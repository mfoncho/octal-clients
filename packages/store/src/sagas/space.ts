import { put, takeEvery } from "redux-saga/effects";
import client, { io } from "@octal/client";
import { dispatch } from "..";
import { SpaceSchema as Schema, NormalizedSpace } from "../schemas";
import * as SpaceActions from "../actions/space";
import * as TopicActions from "../actions/topic";
import * as RoleActions from "../actions/role";
import * as Actions from "../actions/types";
import * as MemberActions from "../actions/member";
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
    } catch (e: any) {}
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
        yield put(SpaceActions.spaceShutdown({ id: payload.space_id } as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* join({
    payload,
    resolve,
}: SpaceActions.JoinSpaceAction): Iterable<any> {
    try {
        const data = (yield client.joinSpace(payload)) as any;
        const normalized = yield* normalize(data);
        yield put(SpaceActions.spaceJoined(normalized));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({
    payload,
}:
    | SpaceActions.SpaceLoadedAction
    | SpaceActions.SpacesLoadedAction): Iterable<any> {
    if (!Array.isArray(payload)) {
        payload = [payload];
    }
    for (let space of payload as any) {
        const topic = `space:${space.id}`;

        if (client.topic(topic)) continue;

        let ch = client.channel(topic);

        ch.on("space.updated", (payload: io.Space) => {
            let normalized = normalizeSpace(payload);
            dispatch(SpaceActions.spaceUpdated(normalized));
        });

        ch.on("permissions.updated", (payload: io.SpaceRole) => {
            dispatch(RoleActions.spaceRoleUpdated(payload));
        });

        ch.on("space.shutdown", (payload: io.Space) => {
            dispatch(SpaceActions.spaceShutdown(payload as any));
        });

        ch.on("topic.created", (payload: io.Topic) => {
            dispatch(TopicActions.topicCreated(payload));
        });

        ch.on("topic.updated", (payload: io.Topic) => {
            dispatch(TopicActions.topicUpdated(payload));
        });

        ch.on("topic.deleted", (payload: io.Topic) => {
            dispatch(TopicActions.topicDeleted(payload));
        });

        ch.on("restored", (payload: io.Space) => {
            let normalized = normalizeSpace(payload);
            dispatch(SpaceActions.spaceRestored(normalized as any));
        });

        ch.on("role.created", (payload: io.SpaceRole) => {
            dispatch(RoleActions.spaceRoleCreated(payload));
        });

        ch.on("role.deleted", (payload: io.SpaceRole) => {
            dispatch(RoleActions.spaceRoleDeleted(payload));
        });

        ch.on("member.left", (payload: io.Member) => {
            dispatch(MemberActions.memberLeft(payload as any));
        });

        ch.on("member.joined", (payload: io.Member) => {
            dispatch(MemberActions.memberJoined(payload as any));
        });

        ch.subscribe()
            .receive("ok", () => {})
            .receive("error", () => {});
    }
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

function* unsubscribe({
    payload,
}: SpaceActions.SpaceShutdownAction): Iterable<any> {
    const topic = `space:${payload.id}`;
    let channel = client.topic(topic);
    if (channel) {
        channel.unsubscribe();
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: init },

    { effect: takeEvery, type: Actions.SHUTDOWN_SPACE, handler: shutdown },

    { effect: takeEvery, type: Actions.CREATE_SPACE, handler: create },

    { effect: takeEvery, type: Actions.UPDATE_SPACE, handler: update },

    { effect: takeEvery, type: Actions.SPACE_LOADED, handler: subscribe },

    { effect: takeEvery, type: Actions.SPACES_LOADED, handler: subscribe },

    { effect: takeEvery, type: Actions.SPACE_JOINED, handler: subscribe },

    { effect: takeEvery, type: Actions.SPACE_CREATED, handler: subscribe },

    { effect: takeEvery, type: Actions.SPACE_RESTORED, handler: subscribe },

    { effect: takeEvery, type: Actions.SPACE_SHUTDOWN, handler: unsubscribe },

    { effect: takeEvery, type: Actions.LOAD_SPACE, handler: load },

    { effect: takeEvery, type: Actions.LOAD_SPACES, handler: loads },

    { effect: takeEvery, type: Actions.JOIN_SPACE, handler: join },
];
