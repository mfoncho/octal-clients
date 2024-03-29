import { put, takeEvery, select } from "redux-saga/effects";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";
import * as AppActions from "../actions/app";
import client, { io, Presence } from "@colab/client";
import { UserSchema } from "../schemas";
import { State } from "..";

function* collectCatalogcast(action: any): Iterable<any> {
    if (action.metadata && action.metadata.broadcast) {
        yield put(
            UserActions.userCatalogcast({
                ...action,
                metadata: { ...action.metadata, broadcast: false },
            })
        );
    }
}

function* broadcast(action: UserActions.UserBroadcastAction): Iterable<any> {
    const store = (yield select()) as any as State;

    if (store.auth.id) {
        let ch = client.topic(`user:${store.auth.id}`);
        if (ch) {
            ch.push("broadcast", action.payload);
        }
    }
}

function* getPreferences(): Iterable<any> {
    try {
        const data = (yield client.getPreferences()) as any;
        yield put(UserActions.preferencesLoaded(data));
    } catch (e) { }
}

function* setPreference({
    payload,
    resolve,
}: UserActions.SetPreferenceAction): Iterable<any> {
    try {
        yield put(UserActions.preferenceSet(payload));
        const data = (yield client.setPreference(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* setStatus({ payload, resolve }: UserActions.SetUserStatusAction) {
    try {
        const update = {
            ...payload.params,
            user_id: payload.user_id,
        };
        //@ts-ignore
        const data = (yield client.setUserStatus(payload)) as any;
        yield put(UserActions.statusUpdated(update));
        resolve.success(data);
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

function* loadUser({
    payload,
    resolve,
}: UserActions.LoadUserAction): Iterable<any> {
    try {
        const data = (yield client.getUser(payload.user_id)) as any;
        yield put(UserActions.userLoaded(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
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
    if (client.topic(topic)) return;
    let channel = client.channel(topic);
    yield put(
        UserActions.userConnected({ user_id: payload.id, topic, channel })
    );
    channel
        .subscribe()
        .receive("ok", () => { })
        .receive("error", () => { });
}

function* connected({
    payload,
}: UserActions.UserConnectedAction): Iterable<any> {
    const { channel } = payload;
    channel.on("broadcast", (payload: any) => {
        let metadata = payload.metadata ?? {};
        metadata.broadcast == false;
        dispatch({ ...payload, metadata });
    });

    channel.on("role.assigned", (payload: UserActions.AssignedPayload) => {
        dispatch(UserActions.userAssigned(payload));
    });

    channel.on("role.unassigned", (payload: UserActions.AssignedPayload) => {
        dispatch(UserActions.userUnassigned(payload));
    });
}

function* syncPresence({
    payload,
}: AppActions.WorkspaceConnectedAction): Iterable<any> {
    let channel = payload.channel;

    channel.on("user.updated", (payload: io.User) => {
        dispatch(UserActions.userUpdated(payload));
    });

    channel.on("status.updated", (payload: io.UserStatus) => {
        dispatch(UserActions.statusUpdated(payload as any));
    });

    const presence = new Presence(channel as any);
    presence.onSync(() => {
        // console.log("online", presence.list());
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
}

export const tasks = [
    { effect: takeEvery, type: "*", handler: collectCatalogcast },
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
        type: Actions.SET_PREFERENCE,
        handler: setPreference,
    },
    { effect: takeEvery, type: Actions.USER_CONNECTED, handler: connected },
    { effect: takeEvery, type: Actions.USER_BROADCAST, handler: broadcast },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: subscribe },
    {
        effect: takeEvery,
        type: Actions.WORKSPACE_CONNECTED,
        handler: syncPresence,
    },
    {
        effect: takeEvery,
        type: Actions.LOAD_USER,
        handler: loadUser,
    },
    { effect: takeEvery, type: Actions.SET_USER_STATUS, handler: setStatus },
    //{ effect: takeEvery, type: "STORE_USERS", handler: store },
];
