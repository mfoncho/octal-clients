import { Socket } from "@colab/endpoint";

export interface Params {}

export default class BaseClient {
    endpoint: any;

    socket: Socket;

    constructor(endpoint: any, socket: Socket) {
        this.endpoint = endpoint;
        this.socket = socket;
    }
}
