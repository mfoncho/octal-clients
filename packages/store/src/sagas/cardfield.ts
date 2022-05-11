import { put, takeEvery } from "redux-saga/effects";
import Client, { io } from "@octal/client";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import { CardFieldSchema, CardFieldValueSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* create({
    payload,
    resolve,
}: BoardActions.CreateCardFieldAction): Iterable<any> {
    try {
        const data = (yield Client.createCardField(payload)) as any;
        const [field, related] = CardFieldSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(BoardActions.cardFieldCreated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* assignChecklist({
    payload,
    resolve,
}: BoardActions.AssignChecklistAction): Iterable<any> {
    try {
        yield Client.assignChecklist(payload);
        yield put(BoardActions.checklistAssigned(payload));
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* unassignChecklist({
    payload,
    resolve,
}: BoardActions.UnassignChecklistAction): Iterable<any> {
    try {
        yield Client.unassignChecklist(payload);
        yield put(BoardActions.checklistUnassigned(payload));
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* createValue({
    payload,
    resolve,
}: BoardActions.CreateCardFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.createCardFieldValue(payload)) as any;
        const [value, related] = CardFieldValueSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        const params = {
            card_id: payload.card_id,
            value: value,
        };
        yield put(BoardActions.cardFieldValueCreated(params as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* updateValue({
    payload,
    resolve,
}: BoardActions.UpdateCardFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.updateCardFieldValue(payload)) as any;
        const [value, related] = CardFieldValueSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        const params = {
            card_id: payload.card_id,
            value: value,
        };
        yield put(BoardActions.cardFieldValueUpdated(params as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteValue({
    payload,
    resolve,
}: BoardActions.DeleteCardFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.deleteCardFieldValue(payload)) as any;
        const params = {
            card_id: payload.card_id,
            field_id: payload.field_id,
            value_id: payload.value_id,
        };
        yield put(BoardActions.cardFieldValueDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* setCardField({
    payload,
    resolve,
}: BoardActions.SetCardFieldValueAction): Iterable<any> {
    try {
        const data = (yield Client.setCardFieldValue(payload)) as any;
        const params = {
            id: payload.field_id,
            card_id: payload.card_id,
            values: [data],
        };
        const [field, related] = CardFieldSchema.normalizeOne(params as any);
        yield put(AppActions.relatedLoaded(related));
        yield put(BoardActions.cardFieldUpdated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: BoardActions.UpdateCardFieldAction): Iterable<any> {
    try {
        const data = (yield Client.updateCardField(payload)) as any;
        const [field, related] = CardFieldSchema.normalizeOne(data);
        yield put(AppActions.relatedLoaded(related));
        yield put(BoardActions.cardFieldUpdated(field as any));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: BoardActions.MoveCardFieldAction): Iterable<any> {
    try {
        yield put(
            BoardActions.cardFieldMoved({
                id: payload.field_id,
                card_id: payload.card_id,
                position: payload.params.position,
            })
        );
        yield Client.moveCardField(payload);
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: BoardActions.DeleteCardFieldAction): Iterable<any> {
    try {
        const data = (yield Client.deleteCardField(payload)) as any;
        const params = { id: payload.field_id, card_id: payload.card_id };
        yield put(BoardActions.cardFieldDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({ payload }: BoardActions.BoardConnectedAction) {
    const { channel } = payload;
    channel.on("card.field.created", (payload: io.CardField) => {
        const [field, related] = CardFieldSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(BoardActions.cardFieldCreated(field as any));
    });

    channel.on("card.field.updated", (payload: io.CardField) => {
        const [field, related] = CardFieldSchema.normalizeOne(payload);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(BoardActions.cardFieldUpdated(field as any));
    });

    channel.on("card.field.deleted", (payload: io.CardField) => {
        dispatch(BoardActions.cardFieldDeleted(payload));
    });

    channel.on(
        "card.field.assigned",
        (payload: BoardActions.AssignChecklistPayload) => {
            dispatch(BoardActions.checklistAssigned(payload));
        }
    );

    channel.on(
        "card.field.unassigned",
        (payload: BoardActions.AssignChecklistPayload) => {
            dispatch(BoardActions.checklistUnassigned(payload));
        }
    );

    channel.on("field.value.created", (payload: io.CardFieldValue) => {
        const [field, related] = CardFieldSchema.normalizeOne(payload as any);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(BoardActions.cardFieldValueCreated(field as any));
    });

    channel.on("field.value.updated", (payload: io.CardFieldValue) => {
        const [field, related] = CardFieldSchema.normalizeOne(payload as any);
        dispatch(AppActions.relatedLoaded(related));
        dispatch(BoardActions.cardFieldValueUpdated(field as any));
    });

    channel.on("field.value.deleted", (payload: io.CardFieldValue) => {
        dispatch(BoardActions.cardFieldValueDeleted(payload as any));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.BOARD_CONNECTED, handler: subscribe },
    { effect: takeEvery, type: Actions.CREATE_CARD_FIELD, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_CARD_FIELD, handler: update },
    { effect: takeEvery, type: Actions.DELETE_CARD_FIELD, handler: trash },
    { effect: takeEvery, type: Actions.SET_CARD_FIELD, handler: setCardField },
    {
        effect: takeEvery,
        type: Actions.MOVE_CARD_FIELD,
        handler: move,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_CARD_FIELD_VALUE,
        handler: deleteValue,
    },
    {
        effect: takeEvery,
        type: Actions.CREATE_CARD_FIELD_VALUE,
        handler: createValue,
    },
    {
        effect: takeEvery,
        type: Actions.UPDATE_CARD_FIELD_VALUE,
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
