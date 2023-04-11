import { put, takeEvery, all } from "redux-saga/effects";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import { RecordSchema } from "../schemas";
import * as CatalogActions from "../actions/catalog";
import * as ThreadActions from "../actions/thread";
import Client, { io } from "@colab/client";

function* normalize(payload: io.Record | io.Record[]): Iterable<any> {
    let [record, related] = RecordSchema.normalize(payload);
    yield put(AppActions.relatedLoaded(related as any) as any);
    return record;
}

function* updated(payload: io.Record | io.Record[]): Iterable<any> {
    let record = yield* normalize(payload);
    if (Array.isArray(record)) {
        yield put(CatalogActions.recordsUpdated(record as any));
    } else {
        yield put(CatalogActions.recordUpdated(record as any));
    }
}

function* normalizeLoad(payload: io.Record | io.Record[]): Iterable<any> {
    let records = yield* normalize(payload);
    if (!Array.isArray(records)) {
        records = [records];
    }
    yield* load(records);
}

function* load(records: any): Iterable<any> {
    let actions = records
        .sort((a: any, b: any) => a.index - b.index)
        .map((record: any) => {
            return put(CatalogActions.recordLoaded(record));
        });
    yield all(actions);
}

function* fetch({
    payload,
    resolve,
}: CatalogActions.FetchRecordsAction): Iterable<any> {
    try {
        const data = (yield Client.fetchRecords(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadCatalogRecords({
    payload,
    resolve,
}: CatalogActions.LoadRecordsAction): Iterable<any> {
    try {
        const data = (yield yield put(
            CatalogActions.fetchRecords(payload)
        )) as any as io.Record[];

        yield* normalizeLoad(data);
        yield put(AppActions.dataLoaded(payload.catalog_id, "records", data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadRecord({
    payload,
    resolve,
}: CatalogActions.LoadRecordAction): Iterable<any> {
    try {
        const data = (yield Client.getRecord(payload)) as any as io.Record;
        yield* normalizeLoad(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadArchivedRecords({
    payload,
    resolve,
}: CatalogActions.LoadArchivedRecordsAction): Iterable<any> {
    try {
        const data = (yield Client.fetchArchivedRecords(payload)) as any;
        yield* normalizeLoad(data);
        yield put(
            AppActions.dataLoaded(
                payload.catalog_id,
                "records.archived",
                data
            )
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}
function* catalogLoadedLoadCatalogRecords({
    payload,
}: CatalogActions.CatalogLoadedAction): Iterable<any> {
    yield put(CatalogActions.loadCatalogRecords({ catalog_id: payload.id }));
}

function* create({
    payload,
    resolve,
}: CatalogActions.CreateRecordAction): Iterable<any> {
    try {
        const data = (yield Client.createRecord(payload)) as any;
        let record = yield* normalize(data);
        yield put(CatalogActions.recordCreated(record));

        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: CatalogActions.UpdateRecordAction): Iterable<any> {
    try {
        const data = (yield Client.updateRecord(payload)) as any;
        let [record, related] = RecordSchema.normalizeOne(data as any) as any;
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordUpdated(record));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: CatalogActions.MoveRecordAction): Iterable<any> {
    try {
        if (payload.index == 0 || payload.index) {
            yield put(
                CatalogActions.recordMoved({
                    id: payload.record_id,
                    index: payload.index,
                    collection_id: payload.collection_id,
                })
            );
        }
        const data = (yield Client.moveRecord(payload)) as any;
        let record = yield* normalize(data);
        yield put(CatalogActions.recordUpdated({ ...record, archived_at: null }));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let records = RecordSchema.getCollection(payload as any);

    if (records.length > 0) {
        yield* load(records);
    }
}

function* trash({
    payload,
    resolve,
}: CatalogActions.DeleteRecordAction): Iterable<any> {
    try {
        const data = (yield Client.deleteRecord(payload)) as any;
        resolve.success(data);
        yield put(CatalogActions.recordDeleted(payload.record_id));
    } catch (e) {
        resolve.error(e);
    }
}

function* archive({
    payload,
    resolve,
}: CatalogActions.ArchiveRecordAction): Iterable<any> {
    try {
        const data = (yield Client.archiveRecord(payload)) as any;
        let record = yield* normalize(data);
        yield put(CatalogActions.recordArchived(record));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* done({
    payload,
    resolve,
}: CatalogActions.CheckRecordAction): Iterable<any> {
    try {
        const data = (yield Client.checkRecord(payload)) as any;
        yield updated(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* undone({
    payload,
    resolve,
}: CatalogActions.CheckRecordAction): Iterable<any> {
    try {
        const data = (yield Client.uncheckRecord(payload)) as any;
        yield updated(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* store({ payload }: any) {
    yield* load(payload);
}

function* subscribe({ payload }: CatalogActions.CatalogConnectedAction) {
    const { channel } = payload;
    channel.on("record.created", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordCreated(record as any));
    });

    channel.on("record.updated", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordUpdated(record as any));
    });

    channel.on("record.checked", (payload: io.Record) => {
        dispatch(CatalogActions.recordUpdated(payload as any));
    });

    channel.on("record.unchecked", (payload: io.Record) => {
        dispatch(CatalogActions.recordUpdated(payload as any));
    });

    channel.on("record.done", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordUpdated(record as any));
    });

    channel.on("record.undone", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordUpdated(record as any));
    });

    channel.on("record.archived", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordArchived(record as any));
    });

    channel.on("record.unarchived", (payload: io.Record) => {
        let [record, related] = RecordSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordUnarchived(record as any));
    });

    channel.on("record.deleted", (payload: any) => {
        dispatch(CatalogActions.recordDeleted(payload.id));
        dispatch(
            ThreadActions.threadDeleted({
                id: payload.thread_id,
                space_id: payload.space_id,
            })
        );
    });

    channel.on("records.reordered", ({ records }: { records: io.Record[] }) => {
        dispatch(CatalogActions.recordsReordered(records));
    });

    channel.on("record.moved", (payload: io.Record) => {
        dispatch(CatalogActions.recordMoved(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.CATALOG_CONNECTED, handler: subscribe },

    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.MOVE_RECORD, handler: move },

    { effect: takeEvery, type: Actions.CREATE_RECORD, handler: create },

    { effect: takeEvery, type: Actions.LOAD_RECORDS, handler: loadCatalogRecords },

    {
        effect: takeEvery,
        type: Actions.CATALOG_LOADED,
        handler: catalogLoadedLoadCatalogRecords,
    },

    {
        effect: takeEvery,
        type: Actions.LOAD_ARCHIVED_RECORDS,
        handler: loadArchivedRecords,
    },
    { effect: takeEvery, type: Actions.STORE_RECORDS, handler: store },

    { effect: takeEvery, type: Actions.STORE_RECORD, handler: store },

    { effect: takeEvery, type: Actions.DELETE_RECORD, handler: trash },

    { effect: takeEvery, type: Actions.CHECK_RECORD, handler: done },

    { effect: takeEvery, type: Actions.LOAD_RECORD, handler: loadRecord },

    { effect: takeEvery, type: Actions.UNCHECK_RECORD, handler: undone },

    { effect: takeEvery, type: Actions.ARCHIVE_RECORD, handler: archive },

    { effect: takeEvery, type: Actions.UPDATE_RECORD, handler: update },

    { effect: takeEvery, type: Actions.FETCH_RECORDS, handler: fetch },
];
