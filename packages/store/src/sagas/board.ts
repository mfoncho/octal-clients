import { takeEvery, put, select } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch, State } from "..";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as SpaceActions from "../actions/space";
//import { BoardSchema } from "../schemas";

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

/*
function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let boards = Object.values(
        payload[BoardSchema.collect] || {}
    ) as io.Board[];
    yield* load(boards);
}
*/

/*
function* loadBoard({ payload }: BoardActions.LoadBoardAction): Iterable<any> {
    //const boards = yield client.getBoard(payload.id);
    //yield put(BoardActions.boardLoaded(boards as any));
}
*/

function* subscribeSpace({
    payload: { channel },
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    channel.on("card_template.created", (payload: io.CardTemplate) => {
        dispatch(BoardActions.cardTemplateCreated(payload));
    });
    channel.on("card_template.deleted", (payload: io.CardTemplate) => {
        dispatch(BoardActions.cardTemplateDeleted(payload));
    });
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.SPACE_CONNECTED,
        handler: subscribeSpace,
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
    }
];
