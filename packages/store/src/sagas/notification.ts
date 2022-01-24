import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import { State } from "..";

function* notifier({ payload }: any): Iterable<any> {
    yield put({ type: "ENQUEUE_SNACK", payload });
}

function* httpError({ payload }: any): Iterable<any> {
    /**
	yield put({type:'NOTIFICATION', payload: { 
		message:(payload.message || payload.reason ), 
		config:{
			variant:'error'
		}
	}});
	**/
}

function* newMessage({ origin, payload }: any): Iterable<any> {}

export const tasks = [
    { effect: takeEvery, type: "NOTIFICATION", handler: notifier },

    { effect: takeEvery, type: "NEW_MESSAGE", handler: newMessage },

    { effect: takeEvery, type: "HTTP_ERROR", handler: httpError },
];
