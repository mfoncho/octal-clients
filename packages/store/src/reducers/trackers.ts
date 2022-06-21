import { Record, Map, List } from "immutable";
import { TrackerRecord } from "../records";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";

export class TrackersStore extends Record({
    entities: Map<string, List<string>>(),
    trackers: Map<string, TrackerRecord>(),
}) {
    addTracker(tracker: any) {
        let record = this.trackers.get(tracker.id);
        if (record) {
            return this;
        }
        let entities = this.entities.get(tracker.entity, List<string>());
        if (!entities.includes(tracker.id))
            entities = entities.push(tracker.id);
        return this.setIn(
            ["trackers", tracker.id],
            new TrackerRecord(tracker)
        ).setIn(["entities", tracker.entity], entities);
    }

    removeTracker(id: string) {
        let record = this.trackers.get(id);
        if (record) {
            let trackers = this.entities
                .get(record.entity, List<string>())
                .filter((id) => id !== record?.id);
            return this.deleteIn(["trackers", id]).setIn(
                ["entities", record.entity],
                trackers
            );
        }
        return this;
    }
}

export const state = new TrackersStore();

export const reducers = {
    [Actions.TRACKERS_LOADED]: (
        store: TrackersStore,
        { payload }: AppActions.TrackersLoadedAction
    ) => {
        return payload.reduce((store, value) => {
            return store.addTracker(value);
        }, store);
    },
    [Actions.TRACKER_CREATED]: (
        store: TrackersStore,
        { payload }: AppActions.TrackerCreatedAction
    ) => {
        return store.addTracker(payload);
    },

    [Actions.TRACKER_DELETED]: (
        store: TrackersStore,
        { payload }: AppActions.TrackerDeletedAction
    ) => {
        return store.removeTracker(payload.id);
    },
};

export default { state, reducers };
