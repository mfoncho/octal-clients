import { put, delay, takeEvery } from "redux-saga/effects";
import client from "@octal/client";
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

function* connect({ payload }: AppActions.AuthAction): Iterable<any> {
    if (payload.user) {
        const topic = `workspace`;

        if (client.topic(topic)) return;

        yield delay(1000);
        let channel = client.channel(topic);

        channel
            .subscribe()
            .receive("ok", () => {})
            .receive("error", () => {});
        yield put(AppActions.workspaceConnected(channel, topic));
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_WORKSPACE, handler: load },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: connect },
];
