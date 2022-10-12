import { mixin } from "@colab/common";
import { Socket } from "@colab/endpoint";
import AuthClient from "./auth";
import BoardClient from "./board";
import SpaceClient from "./space";
import ThreadClient from "./thread";
import TopicClient from "./topic";
import UserClient from "./user";
import WorkspaceClient from "./workspace";
import CalendarClient from "./calendar";
import SocketClient from "./socket";

export interface Interceptor {
    request?: any;
    response?: {
        error?: any;
        success?: any;
    };
}

class Client {
    endpoint: any;

    socket: Socket;

    constructor(endpoint: any, socket: Socket) {
        this.endpoint = endpoint;
        this.socket = socket;
    }

    intercept(interceptor: Interceptor) {
        if (interceptor.request) {
            this.endpoint.interceptors.request.use(interceptor.request);
        }
        if (interceptor.response) {
            this.endpoint.interceptors.response.use(
                interceptor.response.success,
                interceptor.response.error
            );
        }
    }
}

interface Client
    extends BoardClient,
        SpaceClient,
        AuthClient,
        SocketClient,
        ThreadClient,
        WorkspaceClient,
        UserClient,
        CalendarClient,
        TopicClient {}

mixin(Client, [
    TopicClient,
    AuthClient,
    BoardClient,
    WorkspaceClient,
    UserClient,
    CalendarClient,
    ThreadClient,
    SocketClient,
    SpaceClient,
]);

export default Client;
