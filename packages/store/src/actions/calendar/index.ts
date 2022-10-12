import type { io } from "@colab/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    LOAD_CALENDAR,
    CALENDAR_LOADED,
    UPDATE_CALENDAR,
    CALENDAR_UPDATED,
} from "./types";

export * from "./types";

export interface ICalendarParams {
    day: number;
    week: number;
    year: number;
    month: number;
    days: number[];
}

export interface UpdateCalendarPayload {
    calendar_id: string;
    params: Partial<ICalendarParams>;
}

export interface CalendarUpdatedPayload extends Partial<ICalendarParams> {
    id: string;
}
export type LoadCalendarAction = IOAction<LOAD_CALENDAR, any, io.Calendar>;

export type CalendarLoadedAction = Action<CALENDAR_LOADED, io.Calendar>;

export type UpdateCalendarAction = Action<
    UPDATE_CALENDAR,
    UpdateCalendarPayload
>;

export type CalendarUpdatedAction = Action<
    CALENDAR_UPDATED,
    CalendarUpdatedPayload
>;

export function loadCalendar(): LoadCalendarAction {
    return createIOAction<LOAD_CALENDAR>(LOAD_CALENDAR, {});
}

export function calendarLoaded(payload: io.Calendar): CalendarLoadedAction {
    return createAction(CALENDAR_LOADED, payload);
}

export function updateCalendar(
    id: string,
    params: Partial<ICalendarParams>
): UpdateCalendarAction {
    return createAction(UPDATE_CALENDAR, { calendar_id: id, params });
}

export function calendarUpdated(
    id: string,
    params: Partial<ICalendarParams>
): CalendarUpdatedAction {
    return createAction(CALENDAR_UPDATED, { id, ...params });
}
