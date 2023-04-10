import { put, takeEvery } from "redux-saga/effects";
import { dispatch } from "..";
import { io } from "@colab/client";
import * as Actions from "../actions/types";
import * as CatalogActions from "../actions/catalog";

import Client from "@colab/client";

function* create({
    payload,
    resolve: meta,
}: CatalogActions.CreateLabelAction): Iterable<any> {
    try {
        const data = (yield Client.createLabel(payload)) as any;
        yield put(CatalogActions.labelCreated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* destroy({
    payload,
    resolve: meta,
}: CatalogActions.DeleteLabelAction): Iterable<any> {
    try {
        const data = (yield Client.deleteLabel(payload)) as any;
        const param = {
            id: payload.label_id,
            catalog_id: payload.catalog_id,
        };
        yield put(CatalogActions.labelDeleted(param as any));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* update({
    payload,
    resolve: meta,
}: CatalogActions.UpdateLabelAction): Iterable<any> {
    try {
        const data = (yield Client.updateLabel(payload)) as any;
        yield put(CatalogActions.catalogLabelUpdated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}
function* subscribe({ payload }: CatalogActions.CatalogConnectedAction) {
    const { channel } = payload;
    channel.on("label.created", (payload: io.Label) => {
        dispatch(CatalogActions.labelCreated(payload));
    });

    channel.on("label.updated", (payload: io.Label) => {
        dispatch(CatalogActions.catalogLabelUpdated(payload));
    });

    channel.on("label.deleted", (payload: io.Label) => {
        dispatch(CatalogActions.labelDeleted(payload as any));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.CATALOG_CONNECTED, handler: subscribe },
    { effect: takeEvery, type: Actions.CREATE_LABEL, handler: create },
    { effect: takeEvery, type: Actions.DELETE_LABEL, handler: destroy },
    { effect: takeEvery, type: Actions.UPDATE_LABEL, handler: update },
];
