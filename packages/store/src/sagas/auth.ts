import { put, takeEvery } from "redux-saga/effects";
import client, { io } from "@octal/client";
import { userLoaded } from "../actions/user";
import * as Actions from "../actions/types";
import {
    authLoaded,
    LoginAction,
    LogoutAction,
    AuthAction,
    LoadAuthAction,
} from "../actions/app";

function* auth({ payload }: AuthAction): Iterable<any> {
    if ("user" in payload && "token" in payload && "roles" in payload) {
        let data = payload as any as io.Auth;
        yield put(userLoaded(data.user));
        return true;
    }
    return false;
}

function* loadAuth({ resolve: meta }: LoadAuthAction): Iterable<any> {
    try {
        const data = (yield client.getAuth()) as any;
        yield put(authLoaded(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* doLogin({ payload, resolve: meta }: LoginAction): Iterable<any> {
    try {
        const data = (yield client.login(payload)) as any;
        yield put(authLoaded(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* doLogout({ resolve: meta }: LogoutAction): Iterable<any> {
    try {
        const data = (yield client.logout()) as any;
        client.shutdown();
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

export const tasks = [
    //{ effect: takeEvery, type: INIT, handler: init },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: auth },
    { effect: takeEvery, type: Actions.LOGIN, handler: doLogin },
    { effect: takeEvery, type: Actions.LOGOUT, handler: doLogout },
    { effect: takeEvery, type: Actions.LOAD_AUTH, handler: loadAuth },
];
