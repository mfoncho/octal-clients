//import { dispatch } from "..";
import * as Actions from "../actions/types";
import * as SpaceActions from "../actions/space";
import { put, takeEvery } from "redux-saga/effects";

function* spaceSubscribe({
    payload,
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    //console.log(payload);
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.SPACE_CONNECTED,
        handler: spaceSubscribe,
    },
];
