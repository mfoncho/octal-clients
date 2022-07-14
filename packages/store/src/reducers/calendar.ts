import { Record, Map, List } from "immutable";
import { Calendar, ICalendar } from "../records";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as CalendarActions from "../actions/calendar";

export class CalendarStore extends Record({
    loaded: List<string>(),
    calendars: Map<string, Calendar>(),
}) {
    getCalendar(id: string) {
        return this.calendars.get(id);
    }

    putLoaded(type: string) {
        return this.update("loaded", (loaded) =>
            loaded.includes(type) ? loaded : loaded.push(type)
        );
    }

    patchCalendar(id: string, params: any) {
        let calendar = this.getCalendar(id) ?? Calendar.make({ id });
        return this.setIn(["calendars", id], calendar.patch(params));
    }

    putCalendar(payload: ICalendar) {
        let { id, ...params } = payload;
        let calendar = this.getCalendar(id);
        if (calendar) {
            return this.patchCalendar(id, params);
        }
        return this.setIn(["calendars", id], Calendar.make(params));
    }
}

export const state = new CalendarStore({});

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.CALENDAR_LOADED]: (
        store: CalendarStore,
        { payload }: CalendarActions.CalendarLoadedAction
    ) => {
        return store.putCalendar(payload as any);
    },

    [Actions.CARDS_LOADED]: (
        store: CalendarStore,
        { metadata }: BoardActions.CardsLoadedAction
    ) => {
        if (metadata && metadata.type == "calendar") {
            return store.putLoaded("cards");
        }
        return store;
    },

    [Actions.CALENDAR_UPDATED]: (
        store: CalendarStore,
        { payload }: CalendarActions.CalendarUpdatedAction
    ) => {
        return store.patchCalendar(payload.id, payload);
    },
};

export default { state, reducers };
