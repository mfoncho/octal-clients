import { Channel } from "@colab/endpoint";

export interface Object {
    [key: string]:
        | string
        | null
        | string[]
        | number
        | number[]
        | Object
        | Object[];
}

export type Args = string | number | Object | number[] | string[] | Object[];

const defaultTimeout = 1000 * 60 * 60 * 24;

export default class LiveState {
    channel: Channel;

    constructor(channel: Channel) {
        this.channel = channel;
    }

    close() {
        return new Promise((resolve, reject) => {
            this.channel
                .unsubscribe()
                .receive("ok", resolve)
                .receive("error", reject)
                .receive("timeout", resolve);
        });
    }

    init<T = any>(params: Object) {
        if (this.channel.open || this.channel.opening) {
            return this.state<T>();
        }
        return new Promise<T>((resolve, reject) => {
            this.channel
                .subscribe(params)
                .receive("ok", resolve)
                .receive("error", reject)
                .receive("timeout", reject);
        });
    }

    call<T = any>(
        proc: string,
        params: Args = {},
        timeout: number = defaultTimeout
    ) {
        return new Promise<T>((resolve, reject) => {
            this.channel
                .push(`call:${proc}`, params, timeout)
                .receive("ok", resolve)
                .receive("error", reject)
                .receive("timeout", reject);
        });
    }

    state<T = any>() {
        return new Promise<T>((resolve, reject) => {
            this.channel
                .push("state", {})
                .receive("ok", resolve)
                .receive("error", reject)
                .receive("timeout", reject);
        });
    }

    apply<T = any>(
        proc: string,
        params: Args = {},
        timeout: number = defaultTimeout
    ) {
        return new Promise<T>((resolve, reject) => {
            this.channel
                .push(`apply:${proc}`, params, timeout)
                .receive("ok", resolve)
                .receive("error", reject)
                .receive("timeout", reject);
        });
    }

    get live() {
        return this.channel.live;
    }

    get opened() {
        return this.channel.open;
    }
}
