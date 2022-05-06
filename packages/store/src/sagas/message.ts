import { put, select, takeEvery } from "redux-saga/effects";
import { State } from "..";
import {
    FETCH_MESSAGES,
    POST_MESSAGE,
    UPDATE_MESSAGE,
    NEW_MESSAGE,
    FLAG_MESSAGE,
    REACT_MESSAGE,
    PIN_MESSAGE,
    UNREACT_MESSAGE,
    UNPIN_MESSAGE,
    UNFLAG_MESSAGE,
    DELETE_MESSAGE,
    USER_REACTED,
} from "../actions/types";
import client from "@octal/client";
import { MessageSchema, ReactionSchema } from "../schemas";
import {
    userReacted,
    FetchMessagesAction,
    PostMessageAction,
    NewMessageAction,
    newMessage,
    concatConversation,
    PinMessageAction,
    FlagMessageAction,
    UnflagMessageAction,
    UnpinMessageAction,
    UserReactedAction,
    UserUnreactedAction,
    messageUpdated,
    MessageUpdatedAction,
    UnreactMessageAction,
    ReactMessageAction,
    UpdateMessageAction,
    DeleteMessageAction,
    messageDeleted,
    MessageDeletedAction,
    userUnreacted,
    reactionLoaded,
} from "../actions/thread";
import { relatedLoaded } from "../actions/app";

function* fetch({ payload, resolve }: FetchMessagesAction): Iterable<any> {
    try {
        const data = (yield client.fetchMessages(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* post({ payload, resolve }: PostMessageAction): Iterable<any> {
    try {
        const data = (yield client.postMessage(payload)) as any;
        yield put(newMessage(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* created({ payload }: NewMessageAction): Iterable<any> {
    const [normalized, related] = MessageSchema.normalizeOne(payload);
    yield put(relatedLoaded(related));
    yield put(
        concatConversation({
            mode: "append",
            messages: [normalized],
            thread_id: normalized.thread_id!,
        })
    );
}

function* flag({ payload, resolve }: FlagMessageAction): Iterable<any> {
    try {
        const data = (yield client.flagMessage(payload)) as any;
        yield put(messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* pin({ payload, resolve }: PinMessageAction): Iterable<any> {
    try {
        const data = (yield client.pinMessage(payload)) as any;
        yield put(messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unflag({ payload, resolve }: UnflagMessageAction): Iterable<any> {
    try {
        const data = (yield client.unflagMessage(payload)) as any;
        yield put(messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unpin({ payload, resolve }: UnpinMessageAction): Iterable<any> {
    try {
        const data = (yield client.unpinMessage(payload)) as any;
        yield put(messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* react({ payload, resolve }: ReactMessageAction): Iterable<any> {
    try {
        const data = (yield client.reactMessage(payload)) as any;
        yield put(userReacted(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unreact({ payload, resolve }: UnreactMessageAction): Iterable<any> {
    try {
        const data = (yield client.unreactMessage(payload)) as any;
        const { auth } = (yield select()) as any as State;
        const partial = {
            user_id: auth.id,
            reaction: payload.reaction,
            thread_id: payload.thread_id,
            message_id: payload.message_id,
        };
        yield put(userUnreacted(partial as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({ payload, resolve }: DeleteMessageAction): Iterable<any> {
    try {
        const data = (yield client.deleteMessage(payload)) as any;
        yield put(
            messageDeleted({
                id: payload.message_id,
                thread_id: payload.thread_id,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({ payload, resolve }: UpdateMessageAction): Iterable<any> {
    try {
        const data = (yield client.updateMessage(payload)) as any;
        yield put(messageUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* reacted({ payload }: UserReactedAction): Iterable<any> {
    const [normalized, related] = ReactionSchema.normalizeOne(payload);
    yield put(relatedLoaded(related));
    yield put(reactionLoaded(normalized as any));
}

export const tasks = [
    { effect: takeEvery, type: USER_REACTED, handler: reacted },
    { effect: takeEvery, type: FETCH_MESSAGES, handler: fetch },
    { effect: takeEvery, type: POST_MESSAGE, handler: post },
    { effect: takeEvery, type: NEW_MESSAGE, handler: created },
    { effect: takeEvery, type: PIN_MESSAGE, handler: pin },
    { effect: takeEvery, type: FLAG_MESSAGE, handler: flag },
    { effect: takeEvery, type: UNPIN_MESSAGE, handler: unpin },
    { effect: takeEvery, type: UNFLAG_MESSAGE, handler: unflag },
    { effect: takeEvery, type: REACT_MESSAGE, handler: react },
    { effect: takeEvery, type: UNREACT_MESSAGE, handler: unreact },
    { effect: takeEvery, type: UPDATE_MESSAGE, handler: update },
    { effect: takeEvery, type: DELETE_MESSAGE, handler: trash },
];
