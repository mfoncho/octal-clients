import {
    global,
    context,
    CHANNEL_EVENTS,
    DEFAULT_TIMEOUT,
    DEFAULT_VSN,
    SOCKET_STATES,
    TRANSPORTS,
    WS_CLOSE_NORMAL,
} from "./constants";

import Endpoint from "../endpoint";
import Channel from "./channel";
import { Params } from "./types";
import LongPoll from "./longpoll";
import Serializer from "./serializer";
import Timer from "./timer";

export type Callback = (...args: any) => void;

export type StateCallback = [string, Callback];

export interface StateCallbacks {
    open: StateCallback[];
    close: StateCallback[];
    error: StateCallback[];
    message: StateCallback[];
}

export type Decay = (val: number) => number;

export interface IOpts {
    timeout?: number;
    transport?: any;
    binaryType?: string;
    encoder?: any;
    decoder?: any;
    logger?: Callback;
    rejoinAfterMs?: Decay;
    vsn?: string;
    reconnectAfterMs?: Decay;
    params?: () => Params;
    longpollerTimeout?: number;
    heartbeatIntervalMs?: number;
}

export default class Socket {
    channels: Channel[];
    buffer: any[];
    refCounter: number;
    endpoint: string;
    timeout: number;
    transport: any;
    establishedConnections: number;
    closeWasClean: boolean;
    binaryType: string;
    connectClock: number;
    encode: any;
    decode: any;
    connection: any;
    params: () => Params;
    callbacks: StateCallbacks;
    reconnectTimer: Timer;
    reconnectAfterMs: Decay;
    heartbeatIntervalMs: number;
    rejoinAfterMs: Decay;
    logger: Callback | null;
    vsn: string;
    heartbeatTimer: number;
    longpollerTimeout: number;
    pendingHeartbeatRef: string | null;

    constructor(endPoint: string, opts: IOpts = {}) {
        this.callbacks = {
            open: [],
            close: [],
            error: [],
            message: [],
        };
        this.channels = [];
        this.buffer = [];
        this.refCounter = 0;
        this.timeout = opts.timeout || DEFAULT_TIMEOUT;
        this.transport = opts.transport || global.WebSocket || LongPoll;
        this.establishedConnections = 0;
        this.closeWasClean = false;
        this.binaryType = opts.binaryType || "arraybuffer";
        this.connectClock = 1;

        // setup codecs
        this.encode = Serializer.encode.bind(Serializer);
        this.decode = Serializer.decode.bind(Serializer);
        if (this.transport !== LongPoll) {
            this.encode = opts.encoder || Serializer.encode.bind(Serializer);
            this.decode = opts.decoder || Serializer.decode.bind(Serializer);
        }

        let awaitingConnectionOnPageShow: number | null = null;
        if (context && context.addEventListener) {
            context.addEventListener("pagehide", (_e) => {
                if (this.connection) {
                    this.disconnect();
                    awaitingConnectionOnPageShow = this.connectClock;
                }
            });
            context.addEventListener("pageshow", (_e) => {
                if (awaitingConnectionOnPageShow === this.connectClock) {
                    awaitingConnectionOnPageShow = null;
                    this.connect();
                }
            });
        }
        this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
        this.rejoinAfterMs = (tries) => {
            if (opts.rejoinAfterMs) {
                return opts.rejoinAfterMs(tries);
            } else {
                return [1000, 2000, 5000][tries - 1] || 10000;
            }
        };
        this.reconnectAfterMs = (tries) => {
            if (opts.reconnectAfterMs) {
                return opts.reconnectAfterMs(tries);
            } else {
                return (
                    [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] ||
                    5000
                );
            }
        };
        this.logger = opts.logger || null;
        this.longpollerTimeout = opts.longpollerTimeout || 20000;
        this.params = opts.params || (() => ({}));
        this.endpoint = `${endPoint}/${TRANSPORTS.websocket}`;
        this.vsn = opts.vsn || DEFAULT_VSN;
        this.heartbeatTimer = 0;
        this.pendingHeartbeatRef = "";
        this.reconnectTimer = new Timer(() => {
            this.teardown(() => this.connect());
        }, this.reconnectAfterMs);
    }

    replaceTransport(newTransport: any) {
        this.disconnect(() => {}, "rt", "replacing connection");
        this.transport = newTransport;
    }

    protocol() {
        return location.protocol.match(/^https/) ? "wss" : "ws";
    }

    url() {
        let uri = Endpoint.uri(this.endpoint, "", {
            ...this.params(),
            vsn: this.vsn,
        });
        if (uri.charAt(0) !== "/") {
            return uri;
        }
        if (uri.charAt(1) === "/") {
            return `${this.protocol()}:${uri}`;
        }

        //return `${this.protocol()}://${location.host}${uri}`;
        return `${this.protocol()}://192.168.1.2:4000${uri}`;
    }

    disconnect(
        callback: Callback = () => {},
        code: string | number = "disconnect",
        reason: string = "disconnect"
    ) {
        this.connectClock++;
        this.closeWasClean = true;
        this.reconnectTimer.reset();
        this.teardown(callback, code, reason);
    }

    setParams(params: Params | (() => Params)) {
        let prevParams = this.params;
        this.params = () => {
            if (typeof params == "function") {
                return { ...prevParams(), ...params() };
            }
            return { ...prevParams(), ...params };
        };
    }

    connect(params?: Params | (() => Params)) {
        this.connectClock++;
        if (this.connection) {
            return;
        }
        if (params) {
            this.setParams(params);
        }
        this.closeWasClean = false;
        this.connection = new this.transport(this.url());
        this.connection.binaryType = this.binaryType;
        this.connection.timeout = this.longpollerTimeout;
        this.connection.onopen = () => this.onConnOpen();
        this.connection.onerror = (error: any) => this.onConnError(error);
        this.connection.onmessage = (event: any) => this.onConnMessage(event);
        this.connection.onclose = (event: any) => this.onConnClose(event);
    }

    log(kind: string, msg?: any, data?: any) {
        if (this.logger) this.logger(kind, msg, data);
    }

    hasLogger() {
        return this.logger !== null;
    }

    onConnOpen() {
        this.log("transport", `connected to ${this.url()}`);
        this.closeWasClean = false;
        this.establishedConnections++;
        this.flushSendBuffer();
        this.reconnectTimer.reset();
        this.resetHeartbeat();
        this.callbacks.open.forEach(([, callback]) => callback());
    }

    heartbeatTimeout() {
        if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
            if (this.hasLogger()) {
                this.log(
                    "transport",
                    "heartbeat timeout. Attempting to re-establish connection"
                );
            }
            this.abnormalClose("heartbeat timeout");
        }
    }

    resetHeartbeat() {
        if (this.connection && this.connection.skipHeartbeat) {
            return;
        }
        this.pendingHeartbeatRef = null;
        clearTimeout(this.heartbeatTimer);
        setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }

    teardown(
        callback: Callback = () => {},
        code: string | number = "teardown",
        reason: string = "teardown"
    ) {
        if (!this.connection) {
            return callback && callback();
        }

        this.waitForBufferDone(() => {
            if (this.connection) {
                if (code) {
                    this.connection.close(code, reason || "");
                } else {
                    this.connection.close();
                }
            }

            this.waitForSocketClosed(() => {
                if (this.connection) {
                    this.connection.onclose = function () {}; // noop
                    this.connection = null;
                }

                callback && callback();
            });
        });
    }

    waitForBufferDone(callback: Callback, tries = 1) {
        if (
            tries === 5 ||
            !this.connection ||
            !this.connection.bufferedAmount
        ) {
            callback();
            return;
        }

        setTimeout(() => {
            this.waitForBufferDone(callback, tries + 1);
        }, 150 * tries);
    }

    waitForSocketClosed(callback: Callback, tries = 1) {
        if (
            tries === 5 ||
            !this.connection ||
            this.connection.readyState === SOCKET_STATES.closed
        ) {
            callback();
            return;
        }

        setTimeout(() => {
            this.waitForSocketClosed(callback, tries + 1);
        }, 150 * tries);
    }

    onConnClose(event: any) {
        let closeCode = event && event.code;
        if (this.hasLogger()) this.log("transport", "close", event);
        this.triggerChanError();
        clearTimeout(this.heartbeatTimer);
        if (!this.closeWasClean && closeCode !== 1000) {
            this.reconnectTimer.scheduleTimeout();
        }
        this.callbacks.close.forEach(([, callback]) => callback(event));
    }

    onConnError(error: string) {
        if (this.hasLogger()) this.log("transport", error);
        let transportBefore = this.transport;
        let establishedBefore = this.establishedConnections;
        this.callbacks.error.forEach(([, callback]) => {
            callback(error, transportBefore, establishedBefore);
        });
        if (transportBefore === this.transport || establishedBefore > 0) {
            this.triggerChanError();
        }
    }

    triggerChanError() {
        this.channels.forEach((channel) => {
            if (!(channel.errored || channel.closing || channel.close)) {
                channel.trigger(CHANNEL_EVENTS.error, undefined);
            }
        });
    }

    connectionState() {
        switch (this.connection && this.connection.readyState) {
            case SOCKET_STATES.connecting:
                return "connecting";
            case SOCKET_STATES.open:
                return "open";
            case SOCKET_STATES.closing:
                return "closing";
            default:
                return "closed";
        }
    }

    isConnected() {
        return this.connectionState() === "open";
    }

    remove(channel: Channel) {
        this.off(channel.stateChangeRefs);
        this.channels = this.channels.filter(
            (c) => c.joinRef() !== channel.joinRef()
        );
    }

    on(state: keyof StateCallbacks, callback: Callback) {
        let ref = this.makeRef();
        this.callbacks[state].push([ref, callback]);
        return ref;
    }

    off(refs: string[]) {
        for (let key in this.callbacks) {
            this.callbacks[key as keyof StateCallbacks] = this.callbacks[
                key as keyof StateCallbacks
            ].filter(([ref]) => {
                return refs.indexOf(ref) === -1;
            });
        }
    }

    topic(topic: string) {
        return this.channels.find((channel) => channel.topic == topic);
    }

    channel(topic: string) {
        return this.topic(topic) ?? new Channel(topic, this);
    }

    push(data: any) {
        if (this.hasLogger()) {
            let { topic, event, payload, ref, join_ref } = data;
            this.log(
                "push",
                `${topic} ${event} (${join_ref}, ${ref})`,
                payload
            );
        }

        if (this.isConnected()) {
            this.encode(data, (result: any) => this.connection.send(result));
        } else {
            this.buffer.push(() =>
                this.encode(data, (result: any) => this.connection.send(result))
            );
        }
    }

    makeRef() {
        let newRef = this.refCounter + 1;
        if (newRef === this.refCounter) {
            this.refCounter = 0;
        } else {
            this.refCounter = newRef;
        }

        return this.refCounter.toString();
    }

    sendHeartbeat() {
        if (this.pendingHeartbeatRef && !this.isConnected()) {
            return;
        }
        this.pendingHeartbeatRef = this.makeRef();
        this.push({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: this.pendingHeartbeatRef,
        });
        this.heartbeatTimer = setTimeout(
            () => this.heartbeatTimeout(),
            this.heartbeatIntervalMs
        ) as any;
    }

    abnormalClose(reason: string) {
        this.closeWasClean = false;
        if (this.isConnected()) {
            this.connection.close(WS_CLOSE_NORMAL, reason);
        }
    }

    flushSendBuffer() {
        if (this.isConnected() && this.buffer.length > 0) {
            this.buffer.forEach((callback) => callback());
            this.buffer = [];
        }
    }

    onConnMessage(rawMessage: any) {
        this.decode(rawMessage.data, (msg: any) => {
            let { topic, event, payload, ref, join_ref } = msg;
            if (ref && ref === this.pendingHeartbeatRef) {
                clearTimeout(this.heartbeatTimer);
                this.pendingHeartbeatRef = null;
                setTimeout(
                    () => this.sendHeartbeat(),
                    this.heartbeatIntervalMs
                );
                return;
            }

            this.log(
                "receive",
                `${payload.status || ""} ${topic} ${event} ${
                    (ref && "(" + ref + ")") || ""
                }`,
                payload
            );

            for (const channel of this.channels) {
                if (
                    channel.topic == topic &&
                    (!Boolean(join_ref) || join_ref == channel.ref)
                ) {
                    channel.trigger(event, payload, ref, join_ref);
                }
            }

            for (const [, callback] of this.callbacks.message) {
                callback(msg);
            }
        });
    }

    leaveOpenTopic(topic: string) {
        let dupChannel = this.channels.find(
            (c) => c.topic === topic && (c.open || c.opening)
        );
        if (dupChannel) {
            this.log("transport", `leaving duplicate topic "${topic}"`);
            dupChannel.unsubscribe();
        }
    }

    track(channel: Channel) {
        if (!this.isTracking(channel)) this.channels.push(channel);
    }

    untrack(channel: Channel) {
        this.channels = this.channels.filter((ch) => ch !== channel);
    }

    shutdown(callback?: () => void, _code?: number, _reason?: string) {
        for (const channel of this.channels) {
            channel.unsubscribe();
        }
        this.disconnect(callback);
        return this;
    }

    isTracking(channel: Channel) {
        return this.channels.includes(channel);
    }
}
