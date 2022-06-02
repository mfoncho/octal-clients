import { put, takeEvery, select } from "redux-saga/effects";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";
import * as MemberActions from "../actions/member";
import client, { io, Presence } from "@octal/client";
import { UserSchema } from "../schemas";
import { State } from "..";

function* getPreferences(): Iterable<any> {
    try {
        const data = (yield client.getPreferences()) as any;
        yield put(UserActions.preferencesUpdated(data));
    } catch (e) {}
}

function* preferences({
    payload,
    resolve,
}: UserActions.UpdatePreferencesAction): Iterable<any> {
    try {
        const data = (yield client.updatePreferences(payload)) as any;
        yield put(UserActions.preferencesUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* setStatus({ payload, resolve }: UserActions.SetUserStatusAction) {
    try {
        const update = { id: payload.user_id, state: payload.params };
        yield put(UserActions.statusUpdated(update));
        resolve.success(update);
    } catch (e) {
        resolve.error(e);
    }
}

function* presence({
    payload,
    resolve: meta,
}: UserActions.SetUserPresenceAction): Iterable<any> {
    try {
        const { auth } = (yield select()) as any as State;
        const data = (yield client.setUserPresence(
            payload.presence as any
        )) as any;
        yield put(
            UserActions.presenceUpdated({
                user_id: auth.id,
                state: payload.presence,
            })
        );
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* update({
    payload,
    resolve,
}: UserActions.UpdateUserProfileAction): Iterable<any> {
    try {
        const data = (yield client.updateUserProfile(payload as any)) as any;
        const { auth } = (yield select()) as any as State;
        yield put(UserActions.userUpdated({ id: auth.id, ...data } as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* password({
    payload,
    resolve,
}: UserActions.UpdateUserPasswordAction): Iterable<any> {
    try {
        const data = (yield client.updatePassword(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: any): Iterable<any> {
    let users = Object.values(payload[UserSchema.collect] || {}) as io.User[];
    if (users.length > 0) {
        yield put(UserActions.usersLoaded(users));
    }
}

function* subscribe({ payload }: any): Iterable<any> {
    const topic = `user:${payload.id}`;
    let channel = client.channel(topic);
    yield put(
        UserActions.userConnected({ user_id: payload.id, topic, channel })
    );
    channel
        .subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});
}

function* syncPresence(): Iterable<any> {
    const topic = "workspace";

    let channel = client.channel(topic);

    channel.on("user.updated", (payload: io.User) => {
        dispatch(UserActions.userUpdated(payload));
    });

    channel.on("status.updated", (payload: io.User) => {
        dispatch(UserActions.statusUpdated(payload as any));
    });

    const presence = new Presence(channel as any);
    presence.onSync(() => {
        //console.log("online", presence.list());
    });

    presence.onJoin((id, current: io.PresenceSync, pres: io.PresenceSync) => {
        if (current && id) {
            const presence = { ...pres.metas[pres.metas.length - 1] };
            dispatch(UserActions.presenceUpdated({ user_id: id, ...presence }));
        } else if (id) {
            const presence = pres.metas[0];
            dispatch(UserActions.presenceLoaded({ user_id: id, ...presence }));
        }
    });

    presence.onLeave((id, current) => {
        if (id && current.metas.length == 0) {
            dispatch(UserActions.removePresence({ user_id: id }));
        }
    });

    channel
        .subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: getPreferences },
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },
    { effect: takeEvery, type: Actions.SET_USER_PRESENCE, handler: presence },
    { effect: takeEvery, type: Actions.UPDATE_USER_PROFILE, handler: update },
    {
        effect: takeEvery,
        type: Actions.UPDATE_USER_PASSWORD,
        handler: password,
    },
    {
        effect: takeEvery,
        type: Actions.UPDATE_PREFERENCES,
        handler: preferences,
    },
    { effect: takeEvery, type: Actions.AUTH, handler: subscribe },
    { effect: takeEvery, type: Actions.AUTH, handler: syncPresence },
    { effect: takeEvery, type: Actions.SET_USER_STATUS, handler: setStatus },
    //{ effect: takeEvery, type: "STORE_USERS", handler: store },
];
