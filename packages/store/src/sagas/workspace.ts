import { put, takeEvery } from "redux-saga/effects";
import client from "@octal/client";
import { dispatch } from "..";
import { io } from "@octal/client";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";

function* load({ resolve }: AppActions.LoadWorkspaceAction): Iterable<any> {
    try {
        const data = (yield client.getWorkspace()) as any;
        yield put(AppActions.workspaceLoaded(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadNames({}: AppActions.AuthAction): Iterable<any> {
    try {
        const data = (yield client.fetchNames()) as any;
        yield put(AppActions.namesLoaded(data));
    } catch (e) {}
}

function* connect({ payload }: AppActions.AuthAction): Iterable<any> {
    if (payload.user) {
        const topic = `workspace`;

        if (client.topic(topic)) return;

        let channel = client.channel(topic);

        channel
            .subscribe()
            .receive("ok", () => {})
            .receive("error", () => {});
        yield put(AppActions.workspaceConnected(channel, topic));
    }
}

function* subscribeNames({
    payload,
}: AppActions.WorkspaceConnectedAction): Iterable<any> {
    let channel = payload.channel;

    channel.on("name.created", (payload: io.Name) => {
        dispatch(AppActions.nameLoaded(payload));
    });

    channel.on("name.updated", (payload: io.Name) => {
        dispatch(AppActions.nameUpdated(payload));
    });
    channel.on("name.deleted", (payload: io.Name) => {
        dispatch(AppActions.nameDeleted(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_WORKSPACE, handler: load },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: connect },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: loadNames },
    {
        effect: takeEvery,
        type: Actions.WORKSPACE_CONNECTED,
        handler: subscribeNames,
    },
];
