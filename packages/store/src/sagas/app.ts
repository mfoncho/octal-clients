import { put, takeEvery, select } from "redux-saga/effects";
import client from "@octal/client";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import { State } from "..";

function* init(): Iterable<any> {
    let { auth } = (yield select()) as any as State;
    client.connect({ token: auth.token });
}

function* loadConfig(payload: AppActions.LoadConfigAction): Iterable<any> {
    try {
        const data = (yield client.getConfig()) as any;
        yield put(AppActions.setConfig(data));

        if (payload.resolve) {
            payload.resolve.success(data);
        }
    } catch (e) {
        if (payload.resolve) {
            payload.resolve.error(e);
        }
    }
}

function* loadSite(payload: AppActions.LoadSiteAction): Iterable<any> {
    try {
        const data = (yield client.getSite()) as any;
        yield put(AppActions.setSite(data));

        if (payload.resolve) {
            payload.resolve.success(data);
        }
    } catch (e) {
        if (payload.resolve) {
            payload.resolve.error(e);
        }
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: init },
    { effect: takeEvery, type: Actions.STORE_INIT, handler: loadSite },
    { effect: takeEvery, type: Actions.STORE_INIT, handler: loadConfig },
    { effect: takeEvery, type: Actions.LOAD_SITE, handler: loadSite },
    { effect: takeEvery, type: Actions.LOAD_CONFIG, handler: loadConfig },
];
