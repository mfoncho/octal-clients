import { put, takeEvery } from "redux-saga/effects";
import Client from "@octal/client";
import { ColumnSchema } from "../schemas";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import { relatedLoaded, RelatedLoadedAction } from "../actions/app";

function* fetch({
    payload,
    resolve,
}: BoardActions.FetchColumnsAction): Iterable<any> {
    try {
        const data = (yield Client.fetchColumns(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* load({
    payload,
    resolve,
    metadata,
}: BoardActions.LoadColumnsAction): Iterable<any> {
    try {
        const task = yield put(BoardActions.fetchColumns(payload));

        const columns = (yield task) as any;

        let [normalized, related] = ColumnSchema.normalize(columns);

        yield put(relatedLoaded(related));

        if (Array.isArray(normalized)) {
            yield put(BoardActions.columnsLoaded(normalized, metadata));
        }
        resolve.success(columns);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: BoardActions.MoveColumnAction): Iterable<any> {
    try {
        yield put(
            BoardActions.columnMoved({
                id: payload.column_id,
                position: payload.position,
            })
        );
        const data = (yield Client.moveColumn(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: RelatedLoadedAction): Iterable<any> {
    let columns = ColumnSchema.getCollection(payload as any);
    if (columns.length > 0) {
        yield put(BoardActions.columnsLoaded(columns));
    }
}

function* store({ payload }: BoardActions.StoreColumnsAction): Iterable<any> {
    let [normalized, related] = ColumnSchema.normalize(payload);

    yield put(relatedLoaded(related));

    if (Array.isArray(normalized)) {
        yield put(BoardActions.columnsLoaded(normalized));
    } else {
        yield put(BoardActions.columnLoaded(normalized));
    }
}

function* archive({
    payload,
    resolve,
}: BoardActions.ArchiveColumnAction): Iterable<any> {
    try {
        const data = (yield Client.archiveColumn(payload)) as any;
        yield put(BoardActions.columnArchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: BoardActions.UnarchiveColumnAction): Iterable<any> {
    try {
        const data = (yield Client.unarchiveColumn(payload)) as any;
        yield put(BoardActions.columnUnarchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: BoardActions.UpdateColumnAction): Iterable<any> {
    try {
        const data = (yield Client.updateColumn(payload)) as any;
        yield put(BoardActions.columnUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: BoardActions.DeleteColumnAction): Iterable<any> {
    try {
        const data = (yield Client.deleteColumn(payload)) as any;
        const params = {
            id: payload.column_id,
            board_id: payload.board_id,
        };
        yield put(BoardActions.columnDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* create({
    payload,
    resolve,
}: BoardActions.CreateColumnAction): Iterable<any> {
    try {
        const data = (yield Client.createColumn(payload)) as any;
        yield put(BoardActions.columnCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.CREATE_COLUMN, handler: create },

    { effect: takeEvery, type: Actions.DELETE_COLUMN, handler: trash },

    { effect: takeEvery, type: Actions.UPDATE_COLUMN, handler: update },

    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.FETCH_COLUMNS, handler: fetch },

    { effect: takeEvery, type: Actions.LOAD_COLUMNS, handler: load },

    { effect: takeEvery, type: Actions.STORE_COLUMNS, handler: store },

    { effect: takeEvery, type: Actions.MOVE_COLUMN, handler: move },

    { effect: takeEvery, type: Actions.ARCHIVE_COLUMN, handler: archive },

    { effect: takeEvery, type: Actions.UNARCHIVE_COLUMN, handler: unarchive },
];
