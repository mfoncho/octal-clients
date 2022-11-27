import { CHANNEL_EVENTS, CHANNEL_STATES } from "./constants";

import Message from "./message";
import Timer from "./timer";
import { Params } from "./types";

export type ChannelStates = keyof typeof CHANNEL_EVENTS;

export type EventCallback<T = any> = (
    params: T,
    ref: string,
    joinRef: string
) => any;

export interface Binding {
    ref: string;
    event: string;
    callback: EventCallback;
}

export type AnyAny = [any, any];

export default class Channel {
    state: string;
    assigns: Map<any, any>;
    topic: string;
    params: Params;
    socket: any;
    bindings: Binding[];
    refCounter: number;
    timeout: number;
    joinedOnce: boolean;
    joinPush: Message;
    buffer: Message[];
    stateChangeRefs: string[];
    rejoinTimer: Timer;

    constructor(topic: string, socket: any) {
        this.state = CHANNEL_STATES.closed;
        this.topic = topic;
        this.params = {};
        this.socket = socket;
        this.assigns = new Map([]);
        this.bindings = [];
        this.refCounter = 0;
        this.timeout = this.socket.timeout;
        this.joinedOnce = false;
        this.joinPush = new Message(
            this,
            CHANNEL_EVENTS.join,
            this.params,
            this.timeout
        );
        this.buffer = [];
        this.stateChangeRefs = [];

        this.rejoinTimer = new Timer(() => {
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }, this.socket.rejoinAfterMs);
        this.stateChangeRefs.push(
            this.socket.on("error", () => this.rejoinTimer.reset())
        );
        this.stateChangeRefs.push(
            this.socket.on("open", () => {
                this.rejoinTimer.reset();
                if (this.errored) {
                    this.rejoin();
                }
            })
        );
        this.joinPush.receive("ok", () => {
            this.state = CHANNEL_STATES.joined;
            this.rejoinTimer.reset();
            this.flushBuffer();
        });
        this.joinPush.receive("error", () => {
            this.state = CHANNEL_STATES.errored;
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
        this.on(CHANNEL_EVENTS.close, () => {
            this.rejoinTimer.reset();
            if (this.socket.hasLogger())
                this.socket.log("channel", `close ${this.topic} ${this.ref}`);
            this.state = CHANNEL_STATES.closed;
            this.socket.remove(this);
        });
        this.on(CHANNEL_EVENTS.error, (reason: any) => {
            if (this.socket.hasLogger())
                this.socket.log("channel", `error ${this.topic}`, reason);
            if (this.opening) {
                this.joinPush.reset();
            }
            this.state = CHANNEL_STATES.errored;
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
        this.on(CHANNEL_EVENTS.reply, (payload: any, ref: string) => {
            this.trigger(this.replyEventName(ref), payload);
        });
        this.joinPush.receive("timeout", () => {
            if (this.socket.hasLogger())
                this.socket.log(
                    "channel",
                    `timeout ${this.topic} (${this.ref})`,
                    this.joinPush.timeout
                );
            let leavePush = new Message(
                this,
                CHANNEL_EVENTS.leave,
                {},
                this.timeout
            );
            leavePush.send();
            this.state = CHANNEL_STATES.errored;
            this.joinPush.reset();
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
    }

    has(key: any) {
        return this.assigns.has(key);
    }

    set(key: any, value: any) {
        this.assigns.set(key, value);
        return this;
    }

    get<T = any>(key: any) {
        return this.assigns.get(key) as T | undefined;
    }

    values<T = any>(): IterableIterator<T> {
        return this.assigns.values();
    }

    keys<T = any>(): IterableIterator<T> {
        return this.assigns.keys();
    }

    entries<T = AnyAny>(): IterableIterator<T> {
        return this.assigns.entries() as any;
    }

    clear(key?: any) {
        if (key) {
            this.assigns.delete(key);
        } else {
            this.assigns.clear();
        }
        return this;
    }

    subscribe(params: Params | null = null, timeout?: number): Message {
        if (this.joinedOnce) {
            throw new Error(
                "tried to subscribe multiple times. 'join' can only be called a single time per channel instance"
            );
        } else {
            this.params = params ?? this.params;
            this.timeout = timeout ?? this.timeout;
            this.joinedOnce = true;
            this.rejoin();
            return this.joinPush;
        }
    }

    on(event: string, callback: EventCallback) {
        let ref = String(this.refCounter++);
        this.bindings.push({ event, ref, callback });
        return ref;
    }

    off(ref: string) {
        this.bindings = this.bindings.filter((bind) => ref !== bind.ref);
    }

    unbind(event: string) {
        this.bindings = this.bindings.filter((bind) => bind.event !== event);
    }

    push(event: string, payload: any, timeout?: number) {
        if (!this.joinedOnce) {
            throw new Error(
                `tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`
            );
        }
        let message = new Message(
            this,
            event,
            payload,
            timeout || this.timeout
        );
        if (this.live) {
            message.send();
        } else {
            message.startTimer();
            this.buffer.push(message);
        }

        return message;
    }

    unsubscribe(timeout?: number) {
        let channel = this;
        channel.rejoinTimer.reset();
        channel.joinPush.cancelTimer();

        channel.state = CHANNEL_STATES.leaving;
        let onClose = () => {
            if (channel.socket.hasLogger())
                channel.socket.log("channel", `leave ${this.topic}`);
            channel.trigger(CHANNEL_EVENTS.close, undefined);
            channel.socket.untrack(channel);
        };
        let leavePush = new Message(
            channel,
            CHANNEL_EVENTS.leave,
            {},
            timeout || this.timeout
        );
        leavePush
            .receive("ok", () => onClose())
            .receive("timeout", () => onClose());
        leavePush.send();
        if (!channel.live) {
            leavePush.trigger("ok", {});
        }

        return leavePush;
    }

    joinRef() {
        return this.joinPush.ref;
    }

    rejoin(timeout?: number) {
        if (this.closing) {
            return;
        }
        this.socket.track(this);
        this.socket.leaveOpenTopic(this.topic);
        this.state = CHANNEL_STATES.joining;
        this.joinPush.resend(timeout || this.timeout);
    }

    trigger(event: string, payload: any, ref?: string, joinRef?: string) {
        let bindings = this.bindings.filter((bind) => bind.event === event);

        for (let binding of bindings) {
            let bref = ref || binding.ref;
            let jref = joinRef || this.ref;
            binding.callback(payload, bref, jref);
        }
    }

    flushBuffer() {
        if (this.live) {
            this.buffer.forEach((pushEvent: any) => pushEvent.send());
            this.buffer = [];
        }
    }

    replyEventName(ref: any) {
        return `chan_reply_${ref}`;
    }

    get ref(): string {
        return this.joinPush.ref;
    }

    get errored() {
        return this.state === CHANNEL_STATES.errored;
    }

    get close() {
        return this.state === CHANNEL_STATES.closed;
    }

    get open() {
        return this.state === CHANNEL_STATES.joined;
    }

    get opening() {
        return this.state === CHANNEL_STATES.joining;
    }

    get closing() {
        return this.state === CHANNEL_STATES.leaving;
    }

    get live() {
        return this.socket.isConnected() && this.open;
    }
}
