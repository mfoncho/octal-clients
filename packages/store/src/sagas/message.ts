import { put, select, takeEvery } from "redux-saga/effects";
import { State } from "..";
import * as Actions from "../actions/types";
import client from "@octal/client";
import { MessageSchema, NormalizedMessage } from "../schemas";
import * as ThreadActions from "../actions/thread";
import * as AppActions from "../actions/app";

function* fetch({
    payload,
    resolve,
}: ThreadActions.FetchMessagesAction): Iterable<any> {
    try {
        const data = (yield client.fetchMessages(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* post({
    payload,
    resolve,
}: ThreadActions.PostMessageAction): Iterable<any> {
    try {
        const data = (yield client.postMessage(payload)) as any;
        const [normalized, related] = MessageSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(ThreadActions.newMessage(normalized as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* postDirect({
    payload,
    resolve,
}: ThreadActions.PostDirectMessageAction): Iterable<any> {
    try {
        const data = (yield client.postDirectMessage(payload)) as any;
        const [normalized, related] = MessageSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(ThreadActions.newMessage(normalized as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* flag({
    payload,
    resolve,
}: ThreadActions.FlagMessageAction): Iterable<any> {
    try {
        const data = (yield client.flagMessage(payload)) as any;
        yield put(ThreadActions.messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* pin({
    payload,
    resolve,
}: ThreadActions.PinMessageAction): Iterable<any> {
    try {
        const data = (yield client.pinMessage(payload)) as any;
        yield put(ThreadActions.messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unflag({
    payload,
    resolve,
}: ThreadActions.UnflagMessageAction): Iterable<any> {
    try {
        const data = (yield client.unflagMessage(payload)) as any;
        yield put(ThreadActions.messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unpin({
    payload,
    resolve,
}: ThreadActions.UnpinMessageAction): Iterable<any> {
    try {
        const data = (yield client.unpinMessage(payload)) as any;
        yield put(ThreadActions.messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* react({
    payload,
    resolve,
}: ThreadActions.ReactMessageAction): Iterable<any> {
    try {
        const data = (yield client.reactMessage(payload)) as any;
        yield put(ThreadActions.userReacted(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unreact({
    payload,
    resolve,
}: ThreadActions.UnreactMessageAction): Iterable<any> {
    try {
        const data = (yield client.unreactMessage(payload)) as any;
        const { auth } = (yield select()) as any as State;
        const partial = {
            user_id: auth.id,
            reaction: payload.reaction,
            thread_id: payload.thread_id,
            message_id: payload.message_id,
        };
        yield put(ThreadActions.userUnreacted(partial as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: ThreadActions.DeleteMessageAction): Iterable<any> {
    try {
        const data = (yield client.deleteMessage(payload)) as any;
        yield put(
            ThreadActions.messageDeleted({
                id: payload.message_id,
                thread_id: payload.thread_id,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: ThreadActions.UpdateMessageAction): Iterable<any> {
    try {
        const data = (yield client.updateMessage(payload)) as any;
        yield put(ThreadActions.messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: any): Iterable<any> {
    let messages = Object.values(
        payload[MessageSchema.collect] || {}
    ) as NormalizedMessage[];
    if (messages.length > 0) {
        yield put(ThreadActions.messagesLoaded(messages));
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.FETCH_MESSAGES, handler: fetch },
    { effect: takeEvery, type: Actions.POST_MESSAGE, handler: post },
    {
        effect: takeEvery,
        type: Actions.POST_DIRECT_MESSAGE,
        handler: postDirect,
    },
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },
    { effect: takeEvery, type: Actions.PIN_MESSAGE, handler: pin },
    { effect: takeEvery, type: Actions.FLAG_MESSAGE, handler: flag },
    { effect: takeEvery, type: Actions.UNPIN_MESSAGE, handler: unpin },
    { effect: takeEvery, type: Actions.UNFLAG_MESSAGE, handler: unflag },
    { effect: takeEvery, type: Actions.REACT_MESSAGE, handler: react },
    { effect: takeEvery, type: Actions.UNREACT_MESSAGE, handler: unreact },
    { effect: takeEvery, type: Actions.UPDATE_MESSAGE, handler: update },
    { effect: takeEvery, type: Actions.DELETE_MESSAGE, handler: trash },
];
