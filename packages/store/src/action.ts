import { v4 as UUID } from "uuid";
import { Action, IOAction } from "./types";

export function createAction<Type = string, Payload = any, Meta = any>(
    type: Type,
    payload: Payload,
    metadata?: Meta
): Action<Type, Payload> {
    return { type, payload, metadata: metadata ?? {} };
}

export function createIOAction<
    Type = string,
    Payload = any,
    Success = any,
    Meta = any
>(type: Type, payload: Payload, metadata?: Meta): IOAction<Type, Payload> {
    let error: (reason: any) => void = (_error) => {};

    let success: (data: Success) => void = (_data) => {};

    let promise = new Promise<Success>((res, rej) => {
        error = rej;
        success = res;
    });

    const id = UUID();

    const controller = new AbortController();

    const signal = controller.signal;

    return {
        type: type,

        metadata: metadata ?? {},

        resolve: { error, success },

        payload: payload,

        request: { id, signal },

        catch: <R>(callback: (error: any) => R) => {
            return promise.catch(callback);
        },

        then: <R = never, E = never>(
            onFullfill: (data: Success) => R,
            onReject?: (error: string) => E
        ) => {
            return promise.then(onFullfill, onReject);
        },

        abort: () => {
            return controller.abort();
        },

        finally: <R>(callback: () => R) => {
            return promise.finally(callback);
        },
    };
}
