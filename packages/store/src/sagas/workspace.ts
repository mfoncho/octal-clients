import { put, takeEvery } from "redux-saga/effects";
import client from "@octal/client";
import * as Actions from "../actions/app";

function* load({ resolve }: Actions.LoadWorkspaceAction): Iterable<any> {
    try {
        const data = (yield client.getWorkspace()) as any;
        yield put(Actions.workspaceLoaded(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* connect(_action: Actions.WorkspaceLoadedAction): Iterable<any> {
    const topic = `workspace`;

    if (client.topic(topic)) return;

    let channel = client.channel(topic);

    channel
        .subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});
    yield put(Actions.workspaceConnected(channel, topic));
}

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_WORKSPACE, handler: load },
    { effect: takeEvery, type: Actions.WORKSPACE_LOADED, handler: connect },
];
