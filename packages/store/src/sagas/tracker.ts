import { put, takeEvery } from "redux-saga/effects";
import client from "@octal/client";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";

function* init(): Iterable<any> {
    try {
        const data = (yield client.fetchTrackers()) as any;
        yield put(AppActions.trackersLoaded(data));
    } catch (e) {}
}

function* track({
    resolve,
    payload,
}: AppActions.CreateTrackerAction): Iterable<any> {
    try {
        const tracker = (yield client.createTracker(payload)) as any;
        yield put(AppActions.trackerCreated(tracker));
        resolve.success(tracker);
    } catch (e) {
        resolve.error(e);
    }
}

function* untrack({
    resolve,
    payload,
}: AppActions.DeleteTrackerAction): Iterable<any> {
    try {
        yield client.deleteTracker(payload.id);
        yield put(AppActions.trackerDeleted(payload.id));
        resolve.success(payload);
    } catch (e) {
        console.log(e);
        resolve.error(e);
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: init },
    { effect: takeEvery, type: Actions.CREATE_TRACKER, handler: track },
    { effect: takeEvery, type: Actions.DELETE_TRACKER, handler: untrack },
];
