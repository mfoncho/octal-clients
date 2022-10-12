import React from "react";
import { useDispatch } from "react-redux";
import * as AppAction from "@colab/store/lib/actions/app";
import { useActionTrackers } from "@colab/store";

export function useTrackerActions(entity_id: string) {
    const dispatch = useDispatch();
    const trackers = useActionTrackers(entity_id);

    const track = React.useCallback(
        (target: string, event: string) => {
            const action = AppAction.createTracker({
                event,
                target,
                entity_id,
            });
            return dispatch(action);
        },
        [trackers]
    );

    const untrack = React.useCallback(
        (target: string, event: string) => {
            let id = trackers.get(`${target}:${event}`);
            if (id) {
                const action = AppAction.deleteTracker(id);
                return dispatch(action);
            }
        },
        [trackers]
    );
    return { trackers, track, untrack };
}
