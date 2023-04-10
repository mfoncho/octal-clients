import { put, takeEvery } from "redux-saga/effects";
import client from "@colab/client";
import * as Actions from "../actions/types";
import { RecordSchema } from "../schemas";
import * as CalendarActions from "../actions/calendar";
import * as CatalogActions from "../actions/catalog";
import * as AppActions from "../actions/app";

function* init(): Iterable<any> { }

function* load({ resolve }: CalendarActions.LoadCalendarAction): Iterable<any> {
    try {
        const calendar: any = yield client.getCalendar();
        const [records, related] = RecordSchema.normalizeMany(calendar.records);
        yield put(AppActions.relatedLoaded(related));
        yield put(
            CatalogActions.recordsLoaded(records, {
                root_id: "calendar",
                type: "calendar",
            })
        );
        resolve.success(calendar);
    } catch (e) {
        console.log(e);
    }
}

function* update({
    payload,
}: CalendarActions.UpdateCalendarAction): Iterable<any> {
    yield put(
        CalendarActions.calendarUpdated(payload.calendar_id, payload.params)
    );
}

export const tasks = [
    { effect: takeEvery, type: Actions.INIT, handler: init },
    { effect: takeEvery, type: Actions.LOAD_CALENDAR, handler: load },
    { effect: takeEvery, type: Actions.UPDATE_CALENDAR, handler: update },
];
