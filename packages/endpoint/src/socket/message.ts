import { MESSAGE_STATUS } from "./constants";

export default class Message {
    ref: string;
    sent: boolean;
    payload: any;
    channel: any;
    event: string;
    timeout: number;
    timeoutTimer: any;
    receivedResp: any;
    recHooks: any[];
    refEvent: string;

    constructor(channel: any, event: string, payload: any, timeout: number) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.receivedResp = null;
        this.timeout = timeout;
        this.timeoutTimer = null;
        this.recHooks = [];
        this.sent = false;
        this.ref = null as any;
        this.refEvent = null as any;
    }

    resend(timeout: number) {
        this.timeout = timeout;
        this.reset();
        this.send();
    }

    send() {
        if (this.hasReceived("timeout")) {
            return;
        }
        this.startTimer();
        this.sent = true;
        this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref,
            join_ref: this.channel.joinRef(),
        });
    }

    receive(status: string, callback: any) {
        if (this.hasReceived(status)) {
            callback(this.receivedResp.response);
        }

        this.recHooks.push({ status, callback });
        return this;
    }

    reset() {
        this.cancelRefEvent();
        this.sent = false;
        //this.ref = null;
        this.refEvent = null as any;
        this.receivedResp = null;
    }

    matchReceive({ status, response }: any) {
        this.recHooks
            .filter((h: any) => h.status === status)
            .forEach((h: any) => h.callback(response));
    }

    cancelRefEvent() {
        if (!this.refEvent) {
            return;
        }
        this.channel.off(this.refEvent);
    }

    cancelTimer() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
    }

    startTimer() {
        if (this.timeoutTimer) {
            this.cancelTimer();
        }
        if (!this.ref) {
            this.ref = this.channel.socket.makeRef();
        }
        this.refEvent = this.channel.replyEventName(this.ref);

        this.channel.on(this.refEvent, (payload: any) => {
            this.cancelRefEvent();
            this.cancelTimer();
            this.receivedResp = payload;
            this.matchReceive(payload);
        });

        this.timeoutTimer = setTimeout(() => {
            this.trigger(MESSAGE_STATUS.timeout, {});
        }, this.timeout);
    }

    hasReceived(status: string) {
        return this.receivedResp && this.receivedResp.status === status;
    }

    trigger(status: string, response: any) {
        this.channel.trigger(this.refEvent, { status, response });
    }
}
