import { put, takeEvery } from "redux-saga/effects";
import client from "@octal/client";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";

function* init(): Iterable<any> {
    try {
        const data = (yield client.fetchTrackers()) as any;
        yield put(BoardActions.trackersLoaded(data));
    } catch (e) { }
}

function* track({
    resolve,
    payload,
}: BoardActions.CreateTrackerAction): Iterable<any> {
    try {
        yield client.trackCard(payload);
        yield put(
            BoardActions.trackerCreated({
                entity_id: payload.entity_id,
                event: payload.params.event,
            })
        );
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* untrack({
    resolve,
    payload,
}: BoardActions.DeleteTrackerAction): Iterable<any> {
    try {
        yield client.untrackCard(payload);
        yield put(
            BoardActions.trackerDeleted({
                entity_id: payload.entity_id,
                event: payload.params.event,
            })
        );
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
