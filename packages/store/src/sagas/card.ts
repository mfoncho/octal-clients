import { put, takeEvery, all } from "redux-saga/effects";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import { CardSchema } from "../schemas";
import * as BoardActions from "../actions/board";
import Client, { io } from "@octal/client";

function* normalize(payload: io.Card | io.Card[]): Iterable<any> {
    let [card, related] = CardSchema.normalize(payload);
    yield put(AppActions.relatedLoaded(related as any) as any);
    return card;
}

function* updated(payload: io.Card | io.Card[]): Iterable<any> {
    let card = yield* normalize(payload);
    if (Array.isArray(card)) {
        yield put(BoardActions.cardsUpdated(card as any));
    } else {
        yield put(BoardActions.cardUpdated(card as any));
    }
}

function* normalizeLoad(payload: io.Card | io.Card[]): Iterable<any> {
    let cards = yield* normalize(payload);
    if (!Array.isArray(cards)) {
        cards = [cards];
    }
    yield* load(cards);
}

function* load(cards: any): Iterable<any> {
    let actions = cards
        .sort((a: any, b: any) => a.position - b.position)
        .map((card: any) => {
            return put(BoardActions.cardLoaded(card));
        });
    yield all(actions);
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

function* loadBoardCards({
    payload,
    resolve,
}: BoardActions.LoadCardsAction): Iterable<any> {
    try {
        const data = (yield yield put(
            BoardActions.fetchCards(payload)
        )) as any as io.Card[];

        yield* normalizeLoad(data);
        yield put(AppActions.collectionLoaded(payload.board_id, "cards", data));
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
        let card = yield* normalize(data);
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
        yield put(AppActions.relatedLoaded(related));
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

function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let cards = CardSchema.getCollection(payload as any);

    if (cards.length > 0) {
        yield* load(cards);
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
        let card = yield* normalize(data);
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
        let card = yield* normalize(data);
        yield put(BoardActions.cardUnarchived(card));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* store({ payload }: any) {
    yield* load(payload);
}

export const tasks = [
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.MOVE_CARD, handler: move },

    { effect: takeEvery, type: Actions.CREATE_CARD, handler: create },

    { effect: takeEvery, type: Actions.LOAD_CARDS, handler: loadBoardCards },

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
