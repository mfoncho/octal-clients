import { Record, Map, List } from "immutable";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";

export class TrackersStore extends Record({
    entities: Map<string, List<string>>(),
}) {
    addTracker(id: string, event: string) {
        const events = this.entities.get(id, List<string>());
        if (events.includes(event)) return this;
        return this.setIn(["entities", id], events.push(event));
    }

    removeTracker(id: string, event: string) {
        const events = this.entities.get(id, List<string>());
        if (!events.includes(event)) return this;
        return this.setIn(
            ["entities", id],
            events.filter((ev) => ev !== event)
        );
    }
}

export const state = new TrackersStore();

export const reducers = {
    [Actions.TRACKERS_LOADED]: (
        store: TrackersStore,
        { payload }: BoardActions.TrackersLoadedAction
    ) => {
        const keys = Object.keys(payload);
        return keys.reduce((store, key) => {
            let events = payload[key]!;
            return events.reduce((store, event) => {
                return store.addTracker(key, event);
            }, store);
        }, store);
    },
    [Actions.TRACKER_CREATED]: (
        store: TrackersStore,
        { payload }: BoardActions.TrackerCreatedAction
    ) => {
        return store.addTracker(payload.entity_id, payload.event);
    },

    [Actions.TRACKER_DELETED]: (
        store: TrackersStore,
        { payload }: BoardActions.TrackerDeletedAction
    ) => {
        return store.removeTracker(payload.entity_id, payload.event);
    },
};

export default { state, reducers };
