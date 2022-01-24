import LiveState from "./livestate";
import BaseClient from "./base";
export { Presence } from "phoenix";

export default class SocketClient extends BaseClient {
    get channels() {
        return this.socket.channels;
    }

    get connected(): boolean {
        return this.socket.isConnected();
    }

    livestate(topic: string) {
        return new LiveState(this.channel(topic));
    }

    topic(topic: string) {
        return this.channels.find((channel: any) => channel.topic == topic);
    }

    subscribed(topic: string) {
        return Boolean(
            this.channels.find((channel: any) => channel.topic == topic)
        );
    }

    connect(params: { version?: string; token: string }) {
        this.socket.connect({ token: params.token });
        return this;
    }

    disconnect(callback?: () => void, _code?: number, _reason?: string) {
        this.socket.disconnect(callback);
        return this;
    }

    shutdown(callback?: () => void, _code?: number, _reason?: string) {
        for (const channel of this.channels) {
            channel.unsubscribe();
        }
        this.socket.disconnect(callback);
        return this;
    }

    channel(topic: string) {
        return this.socket.channel(topic);
    }
}
