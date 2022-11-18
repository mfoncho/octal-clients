import { put, takeEvery } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch } from "..";
import { SpaceSchema as Schema, NormalizedSpace } from "../schemas";
import * as UserActions from "../actions/user";
import * as SpaceActions from "../actions/space";
import * as Actions from "../actions/types";
import { relatedLoaded } from "../actions/app";

function normalizeSpace(payload: io.Space) {
    const [normalized, related] = Schema.normalize(payload);
    dispatch(relatedLoaded(related));
    return normalized as NormalizedSpace;
}

function* normalize(payload: io.Space | io.Space[]): Iterable<any> {
    const [normalized, related] = Schema.normalize(payload);
    yield put(relatedLoaded(related));
    return normalized;
}

function* init(): Iterable<any> {
    try {
        const data = (yield client.fetchSpaces({})) as any;
        const normalized = yield* normalize(data);
        for (let space of normalized) {
            yield put(SpaceActions.spaceLoaded(space));
        }
    } catch (e: any) {
        console.log(e);
    }
}

function* load({
    payload,
    resolve,
}: SpaceActions.LoadSpaceAction): Iterable<any> {
    try {
        const data = (yield client.getSpace(payload)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spaceLoaded(normalized as any));
        resolve.success(data);
    } catch (e: any) {
        resolve.error(e);
    }
}

function* loads({
    payload,
    resolve,
}: SpaceActions.LoadSpacesAction): Iterable<any> {
    try {
        const data = (yield client.fetchSpaces(payload)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spacesLoaded(normalized as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* shutdown({
    payload,
    resolve,
}: SpaceActions.ShutdownSpaceAction): Iterable<any> {
    try {
        const data = (yield client.shutdownSpace(payload)) as any;
        yield put(SpaceActions.purgeSpace({ space_id: payload.space_id }));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* connect({ payload }: SpaceActions.SpaceLoadedAction): Iterable<any> {
    const topic = `space:${payload.id}`;

    if (client.topic(topic)) return;

    let channel = client.channel(topic);

    yield put(
        SpaceActions.spaceConnected({ space_id: payload.id!, topic, channel })
    );

    channel
        .subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});
}

function* create({
    payload,
    resolve,
}: SpaceActions.CreateSpaceAction): Iterable<any> {
    try {
        const data = (yield client.createSpace(payload)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spaceCreated(normalized));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: SpaceActions.UpdateSpaceAction): Iterable<any> {
    try {
        const data = (yield client.updateSpace(payload as any)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spaceUpdated(normalized));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* joinSpace({
    payload,
    resolve,
}: SpaceActions.JoinSpaceAction): Iterable<any> {
    try {
        const data = (yield client.joinSpace(payload)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spaceLoaded(normalized));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* leaveSpace({
    payload,
    resolve,
}: SpaceActions.LeaveSpaceAction): Iterable<any> {
    try {
        const data = (yield client.leaveSpace(payload)) as any;
        //yield put(MemberActions.leaveSpace(payload));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* userConnected({
    payload,
}: UserActions.UserConnectedAction): Iterable<any> {
    const { channel } = payload;

    channel.on("space.joined", (payload: io.Member) => {
        dispatch(SpaceActions.loadSpace(payload));
    });
    channel.on("space.left", (payload: any) => {
        dispatch(SpaceActions.purgeSpace(payload));
    });
}

function* disconnect({
    payload,
}: SpaceActions.SpacePurgedAction): Iterable<any> {
    const topic = `space:${payload.space_id}`;
    let channel = client.topic(topic);
    if (channel) {
        channel.unsubscribe();
    }
}

function* subscribe({
    payload,
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    const { channel } = payload;

    channel.on("space.updated", (payload: io.Space) => {
        let normalized = normalizeSpace(payload);
        dispatch(SpaceActions.spaceUpdated(normalized));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: init },

    { effect: takeEvery, type: Actions.USER_CONNECTED, handler: userConnected },

    { effect: takeEvery, type: Actions.SPACE_CONNECTED, handler: subscribe },

    { effect: takeEvery, type: Actions.SHUTDOWN_SPACE, handler: shutdown },

    { effect: takeEvery, type: Actions.CREATE_SPACE, handler: create },

    { effect: takeEvery, type: Actions.UPDATE_SPACE, handler: update },

    { effect: takeEvery, type: Actions.SPACE_LOADED, handler: connect },

    { effect: takeEvery, type: Actions.SPACE_CREATED, handler: connect },

    { effect: takeEvery, type: Actions.SPACE_PURGED, handler: disconnect },

    { effect: takeEvery, type: Actions.LOAD_SPACE, handler: load },

    { effect: takeEvery, type: Actions.JOIN_SPACE, handler: joinSpace },

    { effect: takeEvery, type: Actions.LEAVE_SPACE, handler: leaveSpace },

    { effect: takeEvery, type: Actions.LOAD_SPACES, handler: loads },
];
