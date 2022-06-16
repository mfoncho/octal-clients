import Endpoint, { Socket } from "@octal/endpoint";
import Client from "./client";
export * from "./types";
export { Presence } from "./socket";
export { default as LiveState } from "./livestate";

export const endpoint = Endpoint.create({
    baseURL: `${window.location.origin}/api`,
});
export const socket = new Socket("/socket");
export default new Client(endpoint, socket);
