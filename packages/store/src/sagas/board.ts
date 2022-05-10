import { takeEvery, put } from "redux-saga/effects";
import client, { io } from "@octal/client";
import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as SpaceActions from "../actions/space";
import { RelatedLoadedAction } from "../actions/app";
import { BoardSchema, CardSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* create({
    payload,
    resolve: meta,
}: BoardActions.CreateBoardAction): Iterable<any> {
    try {
        const data = (yield client.createBoard(payload)) as any;
        yield put(BoardActions.boardLoaded(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* update({
    payload,
    resolve: meta,
}: BoardActions.UpdateBoardAction): Iterable<any> {
    try {
        const data = (yield client.updateBoard(payload)) as any;
        yield put(BoardActions.boardUpdated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* trash({
    payload,
    resolve: meta,
}: BoardActions.DeleteBoardAction): Iterable<any> {
    try {
        const data = (yield client.deleteBoard({
            ...payload,
        })) as any;
        yield put(
            BoardActions.boardDeleted({
                id: payload.board_id,
                space_id: payload.space_id,
            })
        );
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* subscribe({
    payload,
}:
    | BoardActions.BoardLoadedAction
    | BoardActions.BoardsLoadedAction): Iterable<any> {
    if (!Array.isArray(payload)) {
        payload = [payload];
    }
    for (let board of payload as any) {
        const topic = `board:${board.id}`;

        if (client.topic(topic)) continue;

        let ch = client.channel(topic);

        ch.on("card.created", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardCreated(card as any));
        });

        ch.on("card.updated", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardUpdated(card as any));
        });

        ch.on("card.done", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardUpdated(card as any));
        });

        ch.on("card.undone", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardUpdated(card as any));
        });

        ch.on("card.archived", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardArchived(card as any));
        });

        ch.on("card.unarchived", (payload: io.Card) => {
            let [card, related] = CardSchema.normalizeOne(payload);
            dispatch(AppActions.relatedLoaded(related));
            dispatch(BoardActions.cardUnarchived(card as any));
        });

        ch.on("card.deleted", (payload: io.Card) => {
            dispatch(BoardActions.cardDeleted(payload.id));
        });

        ch.on("column.created", (payload: io.Column) => {
            dispatch(BoardActions.columnCreated(payload));
        });

        ch.on("column.updated", (payload: io.Column) => {
            dispatch(BoardActions.columnUpdated(payload as any));
        });

        ch.on("column.archived", (payload: io.Column) => {
            dispatch(BoardActions.columnUpdated(payload as any));
        });

        ch.on("column.unarchived", (payload: io.Column) => {
            dispatch(BoardActions.columnUpdated(payload as any));
        });

        ch.on("column.deleted", (payload: io.Column) => {
            dispatch(BoardActions.columnDeleted(payload));
        });

        ch.on("label.created", (payload: io.Label) => {
            dispatch(BoardActions.labelCreated(payload));
        });

        ch.on("label.updated", (payload: io.Label) => {
            dispatch(BoardActions.boardLabelUpdated(payload));
        });

        ch.on("label.deleted", (payload: io.Label) => {
            dispatch(BoardActions.labelDeleted(payload as any));
        });

        ch.on("cards.reordered", ({ cards }: { cards: io.Card[] }) => {
            dispatch(BoardActions.cardsReordered(cards));
        });

        ch.on("columns.reordered", ({ columns }: { columns: io.Column[] }) => {
            dispatch(BoardActions.columnsReordered(columns));
        });

        ch.subscribe()
            .receive("ok", () => {})
            .receive("error", () => {});
    }
}

function* related({ payload }: RelatedLoadedAction): Iterable<any> {
    let boards = Object.values(
        payload[BoardSchema.collect] || {}
    ) as io.Board[];
    yield* load(boards);
}

function* load(boards: io.Board[]): Iterable<any> {
    for (let board of boards) {
        yield put(BoardActions.boardLoaded(board as any));
    }
}

/*
function* loadBoard({ payload }: BoardActions.LoadBoardAction): Iterable<any> {
    //const boards = yield client.getBoard(payload.id);
    //yield put(BoardActions.boardLoaded(boards as any));
}
*/

function* loadSpaceBoard({
    payload,
}: BoardActions.LoadSpaceBoardsAction): Iterable<any> {
    //@ts-ignore
    const boards: io.Board[] = yield client.fetchBoards(payload.id);
    yield* load(boards);
}

function* spaceLoaded({
    payload,
}: SpaceActions.SpaceLoadedAction): Iterable<any> {
    yield put(BoardActions.loadSpaceBoards(payload.id!));
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.LOAD_BOARDS,
        handler: loadSpaceBoard,
    },
    { effect: takeEvery, type: Actions.SPACE_LOADED, handler: spaceLoaded },
    {
        effect: takeEvery,
        type: Actions.SPACES_LOADED,
        handler: spaceLoaded,
    },
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },
    { effect: takeEvery, type: Actions.BOARD_LOADED, handler: subscribe },
    { effect: takeEvery, type: Actions.CREATE_BOARD, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_BOARD, handler: update },
    { effect: takeEvery, type: Actions.DELETE_BOARD, handler: trash },
];
