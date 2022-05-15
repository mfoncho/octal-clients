import { put, select, takeEvery } from "redux-saga/effects";
import { MessageSchema } from "../schemas";
import client, { io } from "@octal/client";
import { dispatch } from "..";
import { relatedLoaded } from "../actions/app";
import * as SpaceActions from "../actions/space";
import * as ThreadActions from "../actions/thread";
import * as Actions from "../actions/types";
import { State } from "..";

function* load({
    payload,
    resolve: meta,
}: ThreadActions.LoadThreadAction): Iterable<any> {
    try {
        const data = (yield client.loadThread(payload)) as any;
        yield put(ThreadActions.threadLoaded(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* fetch(): Iterable<any> {
    try {
        const data = (yield client.fetchThreads()) as any;
        yield put(ThreadActions.threadsLoaded(data));
    } catch (e) {}
}

function* activity({
    payload,
}: ThreadActions.ThreadActivityAction): Iterable<any> {
    const topic = `thread:${payload.thread_id}`;
    let ch = client.topic(topic);
    if (ch) {
        ch.push(payload.type, {});
    }
}

function* conversation({
    payload,
    resolve: meta,
}: ThreadActions.LoadConversationAction): Iterable<any> {
    const { threads } = (yield select()) as any as State;
    const thread = threads.getThread(payload.thread_id);
    if (!thread) return;

    try {
        const params: any = {};
        if (payload.more == "top") {
            let first = thread.history.first() as any;
            if (first) {
                params.before = first.id;
            }
            params.last = payload.limit;
        } else if (payload.more == "bottom") {
            let last = thread.history.last() as any;
            if (last) {
                params.after = last.id;
            }
            params.first = payload.limit;
        }
        const loading: { top?: boolean; bottom?: boolean } = {};

        if (payload.more == "top") {
            loading.top = true;
        } else if (payload.more == "bottom") {
            loading.bottom = true;
        } else if (payload.more == "around") {
            loading.top = true;
            loading.bottom = true;
        }

        yield put(
            ThreadActions.loadingConversation({
                ...payload,
                loading,
            })
        );

        const data = (yield client.fetchMessages({
            thread_id: payload.thread_id,
            params,
        })) as any;
        const [normalized, related] = MessageSchema.normalizeMany(data);
        yield put(relatedLoaded(related));
        if (payload.more == "top") {
            yield put(
                ThreadActions.concatConversation({
                    mode: "prepend",
                    messages: normalized,
                    thread_id: payload.thread_id,
                })
            );
        } else if (payload.more == "bottom") {
            yield put(
                ThreadActions.concatConversation({
                    mode: "append",
                    messages: normalized,
                    thread_id: payload.thread_id,
                })
            );
        }

        for (let key in loading) {
            loading[key as keyof typeof loading] =
                !loading[key as keyof typeof loading];
        }
        yield put(
            ThreadActions.loadingConversation({
                ...payload,
                loading,
            })
        );
        meta.success(data);
    } catch (e) {
        yield meta.error(e);
    }
}

function* spaceshutdown({
    payload,
}: SpaceActions.SpaceShutdownAction): Iterable<any> {
    const { threads } = (yield select()) as any as State;
    threads.threads.forEach((thread) => {
        if (thread.space_id == payload.id) {
            dispatch(
                ThreadActions.threadDeleted({
                    id: thread.id,
                    space_id: thread.space_id,
                })
            );
        }
    });
}

function* subscribe({
    payload,
}:
    | ThreadActions.ThreadLoadedAction
    | ThreadActions.ThreadsLoadedAction): Iterable<any> {
    if (!Array.isArray(payload)) payload = [payload];

    for (let thread of payload) {
        const topic = `thread:${thread.id}`;

        if (client.topic(topic)) continue;

        let ch = client.channel(topic);

        ch.on("new.message", (payload: io.UserMessage) => {
            dispatch(ThreadActions.newMessage(payload));
        });

        ch.on("user.reacted", (payload: any) => {
            dispatch(ThreadActions.userReacted(payload));
        });

        ch.on("user.unreacted", (payload: any) => {
            dispatch(ThreadActions.userUnreacted(payload));
        });

        ch.on("message.updated", (payload: io.UserMessage) => {
            dispatch(ThreadActions.messageUpdated(payload));
        });

        ch.on("message.deleted", (payload: io.Message) => {
            dispatch(ThreadActions.messageDeleted(payload));
        });

        ch.on("message.pinned", (payload: io.Message) => {
            dispatch(ThreadActions.messageUpdated(payload));
        });

        ch.on("message.flagged", (payload: io.Message) => {
            dispatch(ThreadActions.messageUpdated(payload));
        });

        ch.on("message.unpinned", (payload: io.Message) => {
            dispatch(ThreadActions.messageUpdated(payload));
        });

        ch.on("message.unflagged", (payload: io.Message) => {
            dispatch(ThreadActions.messageUpdated(payload));
        });

        ch.on("typing", (payload: io.Author) => {
            dispatch({ type: "USER", payload });
        });

        ch.subscribe()
            .receive("ok", () => {})
            .receive("error", () => {});
    }
}

function* unsubscribe({
    payload,
}: ThreadActions.ThreadDeletedAction): Iterable<any> {
    const topic = `thread:${payload.id}`;
    const channel = client.topic(topic);
    if (channel) channel.unsubscribe();
}

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_THREAD, handler: load },
    { effect: takeEvery, type: Actions.THREAD_LOADED, handler: subscribe },
    { effect: takeEvery, type: Actions.THREADS_LOADED, handler: subscribe },
    { effect: takeEvery, type: Actions.THREAD_DELETED, handler: unsubscribe },
    { effect: takeEvery, type: Actions.SPACE_SHUTDOWN, handler: spaceshutdown },

    { effect: takeEvery, type: Actions.THREAD_ACTIVITY, handler: activity },
    {
        effect: takeEvery,
        type: Actions.LOAD_CONVERSATION,
        handler: conversation,
    },
    { effect: takeEvery, type: "FETCH_THREADS", handler: fetch },
];
