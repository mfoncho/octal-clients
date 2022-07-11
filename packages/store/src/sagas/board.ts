import { takeEvery, put, all, select } from "redux-saga/effects";
import client, { io } from "@octal/client";
import { dispatch, State } from "..";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as SpaceActions from "../actions/space";
import { BoardSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* create({
    payload,
    resolve,
}: BoardActions.CreateBoardAction): Iterable<any> {
    try {
        const data = (yield client.createBoard(payload)) as any;
        yield put(BoardActions.boardLoaded(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* createCardTemplate({
    payload,
    resolve,
}: BoardActions.CreateCardTemplateAction): Iterable<any> {
    try {
        const data = (yield client.createCardTemplate(payload)) as any;
        yield put(BoardActions.cardTemplateCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteCardTemplate({
    payload,
    resolve,
}: BoardActions.DeleteCardTemplateAction): Iterable<any> {
    try {
        const data = (yield client.deleteCardTemplate(payload)) as any;
        yield put(
            BoardActions.cardTemplateDeleted({
                id: payload.template_id,
                ...payload,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* archive({
    payload,
    resolve,
}: BoardActions.ArchiveBoardAction): Iterable<any> {
    try {
        const data = (yield client.archiveBoard(payload)) as any;
        yield put(BoardActions.boardArchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: BoardActions.UnarchiveBoardAction): Iterable<any> {
    try {
        const data = (yield client.unarchiveBoard(payload)) as any;
        yield put(BoardActions.boardUnarchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
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

function* connect({ payload }: BoardActions.BoardLoadedAction): Iterable<any> {
    const topic = `board:${payload.id}`;

    if (client.topic(topic)) return;

    let channel = client.channel(topic);

    channel
        .subscribe()
        .receive("ok", () => {})
        .receive("error", () => {});

    yield put(BoardActions.boardConnected({ topic, channel, id: payload.id }));
}

function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let boards = Object.values(
        payload[BoardSchema.collect] || {}
    ) as io.Board[];
    yield* load(boards);
}

function* load(boards: io.Board[]): Iterable<any> {
    let actions = boards.map((board) => {
        return put(BoardActions.boardLoaded(board));
    });
    yield all(actions);
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
    yield put(AppActions.collectionLoaded(payload.id, "boards", boards));
}

function* spaceLoaded({
    payload,
}: SpaceActions.SpaceLoadedAction): Iterable<any> {
    yield put(BoardActions.loadSpaceBoards(payload.id!));
}

function* subscribe({
    payload: { channel },
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    channel.on("board.updated", (payload: io.Board) => {
        dispatch(BoardActions.boardUpdated(payload));
    });

    channel.on("board.deleted", (payload: io.Board) => {
        dispatch(BoardActions.boardDeleted(payload));
    });
}

function* unsubscribe({
    payload,
}: BoardActions.BoardPurgedAction): Iterable<any> {
    const topic = `board:${payload.id}`;
    let channel = client.topic(topic);
    if (channel) {
        channel.unsubscribe();
    }
}

function* spacePurged({
    payload,
}: SpaceActions.SpacePurgedAction): Iterable<any> {
    const { boards } = (yield select()) as any as State;
    const bids = boards.spaces.get(payload.id);
    if (bids) {
        for (let id of bids.toArray()) {
            yield put(BoardActions.purgeBoard({ id }));
        }
    }
}

export const tasks = [
    { effect: takeEvery, type: Actions.SPACE_CONNECTED, handler: subscribe },
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
    {
        effect: takeEvery,
        type: Actions.CREATE_CARD_TEMPLATE,
        handler: createCardTemplate,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_CARD_TEMPLATE,
        handler: deleteCardTemplate,
    },
    { effect: takeEvery, type: Actions.BOARD_PURGED, handler: unsubscribe },
    { effect: takeEvery, type: Actions.ARCHIVE_BOARD, handler: archive },
    { effect: takeEvery, type: Actions.UNARCHIVE_BOARD, handler: unarchive },
    { effect: takeEvery, type: Actions.BOARD_LOADED, handler: connect },
    { effect: takeEvery, type: Actions.CREATE_BOARD, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_BOARD, handler: update },
    { effect: takeEvery, type: Actions.DELETE_BOARD, handler: trash },
    { effect: takeEvery, type: Actions.SPACE_PURGED, handler: spacePurged },
];
