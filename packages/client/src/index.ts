import Endpoint, { Socket } from "@colab/endpoint";
import Client from "./client";
export * from "./types";
export { Presence } from "./socket";
export { default as LiveState } from "./livestate";

const BASE_PROTOCOL = window.location.protocol;

const SERVER_HOST = "172.16.1.218:4000";

const isSecure = BASE_PROTOCOL.startsWith("https");

const BASE_HOST = window.location.host;

const BASE_DOMAIN = window.location.origin;

export const endpoint = Endpoint.create({
    baseURL: `${BASE_DOMAIN}/api`,
});
export const socket = new Socket(`${SERVER_HOST}/socket`, {});
export default new Client(endpoint, socket);
