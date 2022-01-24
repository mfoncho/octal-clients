import { put, takeEvery, delay } from "redux-saga/effects";
import { job } from "./helper";

function* pinger({ type, payload }: any): Iterable<any> {
    const wait = 1000 * 60 * 10;

    try {
        while (true) {
            yield delay(wait);

            yield put({ type: "PING" });
        }
    } catch (e) {
        yield put({ type: `${type}_STOPPED` });
    }
}

function* ping({ type, payload }: any) {
    try {
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload });
    }
}

export const tasks = [
    job.singleton("START_PING", "STOP_PING", pinger),
    { effect: takeEvery, type: "PING", handler: ping },
];
