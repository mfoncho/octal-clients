import { put, takeEvery } from "redux-saga/effects";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";

import Client from "@octal/client";

function* create({
    payload,
    resolve: meta,
}: BoardActions.CreateLabelAction): Iterable<any> {
    try {
        const data = (yield Client.createLabel(payload)) as any;
        yield put(BoardActions.labelCreated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* destroy({
    payload,
    resolve: meta,
}: BoardActions.DeleteLabelAction): Iterable<any> {
    try {
        const data = (yield Client.deleteLabel(payload)) as any;
        const param = {
            id: payload.label_id,
            board_id: payload.board_id,
        };
        yield put(BoardActions.labelDeleted(param as any));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* update({
    payload,
    resolve: meta,
}: BoardActions.UpdateLabelAction): Iterable<any> {
    try {
        const data = (yield Client.updateLabel(payload)) as any;
        yield put(BoardActions.boardLabelUpdated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.CREATE_LABEL, handler: create },
    { effect: takeEvery, type: Actions.DELETE_LABEL, handler: destroy },
    { effect: takeEvery, type: Actions.UPDATE_LABEL, handler: update },
];
