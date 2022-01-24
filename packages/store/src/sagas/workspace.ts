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

export const tasks = [
    { effect: takeEvery, type: Actions.LOAD_WORKSPACE, handler: load },
];
