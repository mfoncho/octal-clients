import { put, takeLatest } from "redux-saga/effects";

function* open({ payload }: any): Iterable<any> {
    if (typeof payload === "string") {
        yield put({ type: "SET_DIALOG", payload });
    }
}

function* close(action: any): Iterable<any> {
    yield put({ type: "SET_DIALOG", payload: null });
}

export const tasks = [
    { effect: takeLatest, type: "OPEN_DIALOG", handler: open },
    { effect: takeLatest, type: "CLOSE_DIALOG", handler: close },
];
