import { put, all, takeEvery } from "redux-saga/effects";
import client, { io } from "@octal/client";
import { dispatch } from "..";
import { ColumnSchema } from "../schemas";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as AppActions from "../actions/app";

function* normalize(payload: io.Column | io.Column[]): Iterable<any> {
    let [columns, related] = ColumnSchema.normalize(payload);
    yield put(AppActions.relatedLoaded(related as any) as any);
    return columns;
}

function* load(columns: any): Iterable<any> {
    let actions = columns.map((column: any) => {
        return put(BoardActions.columnLoaded(column));
    });
    yield all(actions);
}

function* normalizeLoad(columns: io.Column[]): Iterable<any> {
    columns = yield* normalize(columns);
    yield* load(columns);
}

function* fetch({
    payload,
    resolve,
}: BoardActions.FetchColumnsAction): Iterable<any> {
    try {
        const data = (yield client.fetchColumns(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* boardLoadedLoadBoardColumns({
    payload,
}: BoardActions.BoardLoadedAction): Iterable<any> {
    yield put(BoardActions.loadBoardColumns({ board_id: payload.id }));
}

function* loadBoardColumns({
    payload,
    resolve,
}: BoardActions.LoadColumnsAction): Iterable<any> {
    try {
        const task = yield put(BoardActions.fetchColumns(payload));

        const columns = (yield task) as any;

        yield* normalizeLoad(columns);
        yield put(
            AppActions.collectionLoaded(payload.board_id, "columns", columns)
        );

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
        const data = (yield client.moveColumn(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let columns = ColumnSchema.getCollection(payload as any);
    if (columns.length > 0) {
        yield* load(columns);
    }
}

function* archive({
    payload,
    resolve,
}: BoardActions.ArchiveColumnAction): Iterable<any> {
    try {
        const data = (yield client.archiveColumn(payload)) as any;
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
        const data = (yield client.unarchiveColumn(payload)) as any;
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
        const data = (yield client.updateColumn(payload)) as any;
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
        const data = (yield client.deleteColumn(payload)) as any;
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
        const data = (yield client.createColumn(payload)) as any;
        yield put(BoardActions.columnCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({ payload }: BoardActions.BoardConnectedAction) {
    const { channel } = payload;
    channel.on("column.created", (payload: io.Column) => {
        dispatch(BoardActions.columnCreated(payload));
    });

    channel.on("column.updated", (payload: io.Column) => {
        dispatch(BoardActions.columnUpdated(payload as any));
    });

    channel.on("column.archived", (payload: io.Column) => {
        dispatch(BoardActions.columnUpdated(payload as any));
    });

    channel.on("column.unarchived", (payload: io.Column) => {
        dispatch(BoardActions.columnUpdated(payload as any));
    });

    channel.on("column.deleted", (payload: io.Column) => {
        dispatch(BoardActions.columnDeleted(payload));
    });

    channel.on("column.moved", (payload: io.Column) => {
        dispatch(BoardActions.columnMoved(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.BOARD_CONNECTED, handler: subscribe },

    {
        effect: takeEvery,
        type: Actions.BOARD_LOADED,
        handler: boardLoadedLoadBoardColumns,
    },

    { effect: takeEvery, type: Actions.CREATE_COLUMN, handler: create },

    { effect: takeEvery, type: Actions.DELETE_COLUMN, handler: trash },

    { effect: takeEvery, type: Actions.UPDATE_COLUMN, handler: update },

    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.FETCH_COLUMNS, handler: fetch },

    {
        effect: takeEvery,
        type: Actions.LOAD_COLUMNS,
        handler: loadBoardColumns,
    },

    { effect: takeEvery, type: Actions.MOVE_COLUMN, handler: move },

    { effect: takeEvery, type: Actions.ARCHIVE_COLUMN, handler: archive },

    { effect: takeEvery, type: Actions.UNARCHIVE_COLUMN, handler: unarchive },
];
