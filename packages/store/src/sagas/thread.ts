import { put, select, takeEvery } from "redux-saga/effects";
import { MessageSchema, NormalizedMessage } from "../schemas";
import client, { io } from "@colab/client";
import { dispatch, State } from "..";
//import { ThreadRecord } from "../records"
import * as AppActions from "../actions/app";
import * as UserActions from "../actions/user";
import * as SpaceActions from "../actions/space";
import * as ThreadActions from "../actions/thread";
import * as Actions from "../actions/types";

function* load({
    payload,
    resolve,
}: ThreadActions.LoadThreadAction): Iterable<any> {
    const { threads } = (yield select()) as any as State;
    const thread = threads.getThread(payload.thread_id);
    try {
        if (thread) {
            resolve.success(thread.toServer() as any);
        } else {
            const data = (yield client.loadThread(payload)) as any;
            yield put(ThreadActions.threadLoaded(data));
            resolve.success(data);
        }
    } catch (e) {
        resolve.error(e);
    }
}

function* activity({
    payload,
}: ThreadActions.ThreadActivityAction): Iterable<any> {
    const { threads } = (yield select()) as any as State;
    const thread = threads.getThread(payload.thread_id);
    if (thread && thread.channel && payload.type === "read") {
        thread.channel.push(payload.type, { timestamp: payload.timestamp });
        const updates = {
            id: payload.thread_id,
            last_read: payload.timestamp,
        };
        yield put(ThreadActions.threadUpdated(updates as any));
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
        const data = (yield client.fetchMessages(payload)) as any;
        const [normalized, related] = MessageSchema.normalizeMany(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(
            ThreadActions.conversationLoaded({
                ...payload,
                messages: normalized,
            })
        );
        meta.success(data);
    } catch (e) {
        yield meta.error(e);
    }
}

function* spacePurged({
    payload,
}: SpaceActions.SpacePurgedAction): Iterable<any> {
    const { threads } = (yield select()) as any as State;
    let ithreads = threads.ispaces.get(payload.space_id);
    if (ithreads) {
        for (let id of ithreads.toArray()) {
            yield put(
                ThreadActions.threadDeleted({
                    id: id,
                    space_id: payload.space_id,
                })
            );
        }
    }
}

function* connect({
    payload,
}: ThreadActions.ThreadLoadedAction): Iterable<any> {
    const topic = `thread:${payload.id}`;

    if (client.topic(topic)) return;

    let channel = client.channel(topic);
    yield put(
        ThreadActions.threadConnected({
            thread_id: payload.id,
            channel: channel,
        })
    );
}

function* subscribe({
    payload,
}: ThreadActions.ThreadConnectedAction): Iterable<any> {
    let ch = payload.channel;

    ch.on("thread.updated", (payload: io.Thread) => {
        dispatch(ThreadActions.threadUpdated(payload as any));
    });

    ch.on("new.message", (payload: io.UserMessage) => {
        const [normalized, related] = MessageSchema.normalize(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(ThreadActions.newMessage(normalized as any));
    });

    ch.on("user.reacted", (payload: any) => {
        dispatch(ThreadActions.userReacted(payload));
    });

    ch.on("user.unreacted", (payload: any) => {
        dispatch(ThreadActions.userUnreacted(payload));
    });

    ch.on("message.updated", (payload: io.UserMessage) => {
        const [normalized, related] = MessageSchema.normalize(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(ThreadActions.messageUpdated(normalized as any));
    });

    ch.on(
        "message.deleted",
        (payload: NormalizedMessage & { id: string; thread_id: string }) => {
            dispatch(ThreadActions.messageDeleted(payload));
        }
    );

    ch.on("message.pinned", (payload: NormalizedMessage) => {
        dispatch(ThreadActions.messageUpdated(payload));
    });

    ch.on("message.flagged", (payload: NormalizedMessage) => {
        dispatch(ThreadActions.messageUpdated(payload));
    });

    ch.on("message.unpinned", (payload: NormalizedMessage) => {
        dispatch(ThreadActions.messageUpdated(payload));
    });

    ch.on("message.unflagged", (payload: NormalizedMessage) => {
        dispatch(ThreadActions.messageUpdated(payload));
    });

    ch.on("typing", (payload: io.Author) => {
        dispatch({ type: "USER", payload });
    });

    ch.subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});
}

function* broadcastDraft({
    type,
    payload,
    metadata,
}: ThreadActions.ThreadDraftUpdatedAction): Iterable<any> {
    if (metadata.push) {
        payload = {
            ...payload,
            params: { ...payload.params, files: undefined },
        };
        yield put(UserActions.userBoardcast({ type, payload }));
    }
}

function* newMessage({
    payload,
}: ThreadActions.NewMessageAction): Iterable<any> {
    const store = (yield select()) as any as State;
    const thread = store.threads.getThread(payload.thread_id!);
    if (thread) {
        if (thread.page.autoScroll || payload.user_id === store.auth.id) {
            const updates = {
                id: thread.id,
                unread_count: 0,
                last_read: payload.timestamp,
            };
            yield put(ThreadActions.threadUpdated(updates as any));
        } else if (!thread.page.autoScroll) {
            const updates = {
                id: thread.id,
                unread_count: thread.unread_count + 1,
            };
            yield put(ThreadActions.threadUpdated(updates as any));
        }
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
    {
        effect: takeEvery,
        type: Actions.THREAD_DRAFT_UPDATED,
        handler: broadcastDraft,
    },
    { effect: takeEvery, type: Actions.NEW_MESSAGE, handler: newMessage },
    { effect: takeEvery, type: Actions.LOAD_THREAD, handler: load },
    { effect: takeEvery, type: Actions.THREAD_LOADED, handler: connect },
    { effect: takeEvery, type: Actions.THREAD_CONNECTED, handler: subscribe },
    { effect: takeEvery, type: Actions.THREAD_DELETED, handler: unsubscribe },
    { effect: takeEvery, type: Actions.SPACE_PURGED, handler: spacePurged },

    { effect: takeEvery, type: Actions.THREAD_ACTIVITY, handler: activity },
    {
        effect: takeEvery,
        type: Actions.LOAD_CONVERSATION,
        handler: conversation,
    },
];
