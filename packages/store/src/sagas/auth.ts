import { put, takeEvery } from "redux-saga/effects";
import client, { io } from "@octal/client";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";
import * as AppActions from "../actions/app";

function* auth({ payload }: AppActions.AuthAction): Iterable<any> {
    if ("user" in payload && "token" in payload && "roles" in payload) {
        let data = payload as any as io.Auth;
        yield put(UserActions.userLoaded(data.user));
        return true;
    }
    return false;
}

function* claim({
    payload,
    resolve,
}: UserActions.ClaimAccountAction): Iterable<any> {
    try {
        const data = (yield client.claimAuth(payload)) as any;
        yield put(UserActions.accountClaimed(payload));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* authStore(data: io.Auth): Iterable<any> {
    if (data.user) {
        yield put(AppActions.authLoaded(data));
    }
}

function* loadAuth({ resolve }: AppActions.LoadAuthAction): Iterable<any> {
    try {
        const data = (yield client.getAuth()) as any;
        yield* authStore(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* doLogin({ payload, resolve }: AppActions.LoginAction): Iterable<any> {
    try {
        const data = (yield client.login(payload)) as any;
        yield* authStore(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* doLogout({ resolve }: AppActions.LogoutAction): Iterable<any> {
    try {
        const data = (yield client.logout()) as any;
        client.shutdown();
        yield put(AppActions.loggedOut());
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

export const tasks = [
    //{ effect: takeEvery, type: INIT, handler: init },
    { effect: takeEvery, type: Actions.CLAIM_ACCOUNT, handler: claim },
    { effect: takeEvery, type: Actions.AUTH_LOADED, handler: auth },
    { effect: takeEvery, type: Actions.LOGIN, handler: doLogin },
    { effect: takeEvery, type: Actions.LOGOUT, handler: doLogout },
    { effect: takeEvery, type: Actions.LOAD_AUTH, handler: loadAuth },
];
