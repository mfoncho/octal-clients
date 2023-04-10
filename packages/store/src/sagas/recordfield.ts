import { put, takeEvery } from "redux-saga/effects";
import Client, { io } from "@colab/client";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as CatalogActions from "../actions/catalog";
import { RecordFieldSchema, RecordFieldValueSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* create({
    payload,
    resolve,
}: CatalogActions.CreateRecordFieldAction): Iterable<any> {
    try {
        const data = (yield Client.createRecordField(payload)) as any;
        const [field, related] = RecordFieldSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordFieldCreated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* assignChecklist({
    payload,
    resolve,
}: CatalogActions.AssignChecklistAction): Iterable<any> {
    try {
        yield Client.assignChecklist(payload);
        yield put(CatalogActions.checklistAssigned(payload));
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* unassignChecklist({
    payload,
    resolve,
}: CatalogActions.UnassignChecklistAction): Iterable<any> {
    try {
        yield Client.unassignChecklist(payload);
        yield put(CatalogActions.checklistUnassigned(payload));
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* createValue({
    payload,
    resolve,
}: CatalogActions.CreateRecordFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.createRecordFieldValue(payload)) as any;
        const [value, related] = RecordFieldValueSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordFieldValueCreated(value as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* updateValue({
    payload,
    resolve,
}: CatalogActions.UpdateRecordFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.updateRecordFieldValue(payload)) as any;
        const [value, related] = RecordFieldValueSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordFieldValueUpdated(value as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteValue({
    payload,
    resolve,
}: CatalogActions.DeleteRecordFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.deleteRecordFieldValue(payload)) as any;
        const params = {
            id: payload.value_id,
            record_id: payload.record_id,
            field_id: payload.field_id,
        };
        yield put(CatalogActions.recordFieldValueDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* setRecordField({
    payload,
    resolve,
}: CatalogActions.SetRecordFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.setRecordFieldValue(payload)) as any;
        const params = {
            id: payload.field_id,
            record_id: payload.record_id,
            values: [data],
        };
        const [field, related] = RecordFieldSchema.normalizeOne(params as any);
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordFieldUpdated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: CatalogActions.UpdateRecordFieldAction): Iterable<any> {
    try {
        const data = (yield Client.updateRecordField(payload)) as any;
        const [field, related] = RecordFieldSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(CatalogActions.recordFieldUpdated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: CatalogActions.MoveRecordFieldAction): Iterable<any> {
    try {
        yield put(
            CatalogActions.recordFieldMoved({
                id: payload.field_id,
                record_id: payload.record_id,
                index: payload.params.index,
            })
        );
        yield Client.moveRecordField(payload);
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: CatalogActions.DeleteRecordFieldAction): Iterable<any> {
    try {
        const data = (yield Client.deleteRecordField(payload)) as any;
        const params = { id: payload.field_id, record_id: payload.record_id };
        yield put(CatalogActions.recordFieldDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({ payload }: CatalogActions.CatalogConnectedAction) {
    const { channel } = payload;
    channel.on("record.field.created", (payload: io.RecordField) => {
        const [field, related] = RecordFieldSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordFieldCreated(field as any));
    });

    channel.on("record.field.updated", (payload: io.RecordField) => {
        const [field, related] = RecordFieldSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordFieldUpdated(field as any));
    });

    channel.on("record.field.moved", (payload: io.RecordField) => {
        dispatch(CatalogActions.recordFieldMoved(payload as any));
    });

    channel.on("record.field.deleted", (payload: io.RecordField) => {
        dispatch(CatalogActions.recordFieldDeleted(payload));
    });

    channel.on(
        "record.field.assigned",
        (payload: CatalogActions.AssignChecklistPayload) => {
            dispatch(CatalogActions.checklistAssigned(payload));
        }
    );

    channel.on(
        "record.field.unassigned",
        (payload: CatalogActions.AssignChecklistPayload) => {
            dispatch(CatalogActions.checklistUnassigned(payload));
        }
    );

    channel.on("field.value.created", (payload: io.RecordFieldValue) => {
        const [field, related] = RecordFieldValueSchema.normalizeOne(
            payload as any
        );
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordFieldValueCreated(field as any));
    });

    channel.on("field.value.updated", (payload: io.RecordFieldValue) => {
        const [field, related] = RecordFieldValueSchema.normalizeOne(
            payload as any
        );
        dispatch(AppActions.relatedLoaded(related));
        dispatch(CatalogActions.recordFieldValueUpdated(field as any));
    });

    channel.on("field.value.deleted", (payload: io.RecordFieldValue) => {
        dispatch(CatalogActions.recordFieldValueDeleted(payload as any));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.CATALOG_CONNECTED, handler: subscribe },
    { effect: takeEvery, type: Actions.CREATE_RECORD_FIELD, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_RECORD_FIELD, handler: update },
    { effect: takeEvery, type: Actions.DELETE_RECORD_FIELD, handler: trash },
    { effect: takeEvery, type: Actions.SET_RECORD_FIELD, handler: setRecordField },
    {
        effect: takeEvery,
        type: Actions.MOVE_RECORD_FIELD,
        handler: move,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_RECORD_FIELD_VALUE,
        handler: deleteValue,
    },
    {
        effect: takeEvery,
        type: Actions.CREATE_RECORD_FIELD_VALUE,
        handler: createValue,
    },
    {
        effect: takeEvery,
        type: Actions.UPDATE_RECORD_FIELD_VALUE,
        handler: updateValue,
    },
    {
        effect: takeEvery,
        type: Actions.ASSIGN_CHECKLIST,
        handler: assignChecklist,
    },
    {
        effect: takeEvery,
        type: Actions.UNASSIGN_CHECKLIST,
        handler: unassignChecklist,
    },
];
