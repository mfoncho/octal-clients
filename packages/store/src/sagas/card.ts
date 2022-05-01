import { put, takeEvery } from "redux-saga/effects";
import * as Actions from "../actions/types";
import { CardSchema } from "../schemas";
import * as BoardActions from "../actions/board";
import { relatedLoaded, RelatedLoadedAction } from "../actions/app";
import Client, { io } from "@octal/client";

function* serialize(payload: io.Card | io.Card[]): Iterable<any> {
    let [card, related] = CardSchema.normalize(payload);
    yield put(relatedLoaded(related as any) as any);
    return card;
}

function* updated(payload: io.Card | io.Card[]) {
    let card = yield* serialize(payload);
    if (Array.isArray(card)) {
        yield put(BoardActions.cardsUpdated(card as any));
    } else {
        yield put(BoardActions.cardUpdated(card as any));
    }
}

function* loaded(payload: io.Card | io.Card[], metadata?: any) {
    let card = yield* serialize(payload);
    if (Array.isArray(card)) {
        yield put(BoardActions.cardsLoaded(card as any, metadata));
    } else {
        yield put(BoardActions.cardLoaded(card as any, metadata));
    }
}

function* fetch({
    payload,
    resolve,
}: BoardActions.FetchCardsAction): Iterable<any> {
    try {
        const data = (yield Client.fetchCards(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* load({
    payload,
    resolve,
    metadata,
}: BoardActions.LoadCardsAction): Iterable<any> {
    try {
        const data = ((yield yield put(
            BoardActions.fetchCards(payload)
        )) as any) as io.Card[];

        yield* loaded(data, metadata);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* create({
    payload,
    resolve,
}: BoardActions.CreateCardAction): Iterable<any> {
    try {
        const data = (yield Client.createCard(payload)) as any;
        let card = yield* serialize(data);
        yield put(BoardActions.cardCreated(card));

        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: BoardActions.UpdateCardAction): Iterable<any> {
    try {
        const data = (yield Client.updateCard(payload)) as any;
        let [card, related] = CardSchema.normalizeOne(data as any) as any;
        yield put(relatedLoaded(related));
        yield put(BoardActions.cardUpdated(card));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: BoardActions.MoveCardAction): Iterable<any> {
    try {
        if (payload.position == 0 || payload.position) {
            yield put(
                BoardActions.cardMoved({
                    id: payload.card_id,
                    position: payload.position,
                    column_id: payload.column_id,
                })
            );
        }
        const data = (yield Client.moveCard(payload)) as any;
        yield put(BoardActions.cardUpdated({ ...data, archived_at: null }));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: RelatedLoadedAction): Iterable<any> {
    let cards = CardSchema.getCollection(payload);

    if (cards.length > 0) {
        yield put(BoardActions.cardsLoaded(cards));
    }
}

function* trash({
    payload,
    resolve,
}: BoardActions.DeleteCardAction): Iterable<any> {
    try {
        const data = (yield Client.deleteCard(payload)) as any;
        resolve.success(data);
        yield put(BoardActions.cardDeleted(payload.card_id));
    } catch (e) {
        resolve.error(e);
    }
}

function* archive({
    payload,
    resolve,
}: BoardActions.ArchiveCardAction): Iterable<any> {
    try {
        const data = (yield Client.archiveCard(payload)) as any;
        let card = yield* serialize(data);
        yield put(BoardActions.cardArchived(card));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* done({
    payload,
    resolve,
}: BoardActions.CompleteCardAction): Iterable<any> {
    try {
        const data = (yield Client.completeCard(payload)) as any;
        yield updated(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* undone({
    payload,
    resolve,
}: BoardActions.CompleteCardAction): Iterable<any> {
    try {
        const data = (yield Client.uncompleteCard(payload)) as any;
        yield updated(data);
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: BoardActions.UnarchiveCardAction): Iterable<any> {
    try {
        const data = (yield Client.unarchiveCard(payload)) as any;
        let card = yield* serialize(data);
        yield put(BoardActions.cardUnarchived(card));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* store({ payload }: any) {
    yield* loaded(payload);
}

export const tasks = [
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.MOVE_CARD, handler: move },

    { effect: takeEvery, type: Actions.CREATE_CARD, handler: create },

    { effect: takeEvery, type: Actions.LOAD_CARDS, handler: load },

    { effect: takeEvery, type: Actions.STORE_CARDS, handler: store },

    { effect: takeEvery, type: Actions.STORE_CARD, handler: store },

    { effect: takeEvery, type: Actions.DELETE_CARD, handler: trash },

    { effect: takeEvery, type: Actions.COMPLETE_CARD, handler: done },

    { effect: takeEvery, type: Actions.UNCOMPLETE_CARD, handler: undone },

    { effect: takeEvery, type: Actions.UNARCHIVE_CARD, handler: unarchive },

    { effect: takeEvery, type: Actions.ARCHIVE_CARD, handler: archive },

    { effect: takeEvery, type: Actions.UPDATE_CARD, handler: update },

    { effect: takeEvery, type: Actions.FETCH_CARDS, handler: fetch },
];
