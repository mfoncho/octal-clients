import { Map } from "immutable";
import moment from "moment";
import { Presence } from "../records";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";

type State = Map<string, Presence>;

export const state = Map<string, Presence>();

export const reducers = {
    [Actions.PRESENCE_LOADED]: (
        state: State,
        { payload }: UserActions.PresenceLoadedAction
    ) => {
        const presence = state.get(payload.user_id);
        if (presence) {
            if (moment(payload.timestamp).isAfter(presence.timestamp)) {
                return state.set(payload.user_id, presence.merge(payload));
            }
            return state;
        }
        return state.set(payload.user_id, new Presence(payload));
    },
    [Actions.PRESENCE_UPDATED]: (
        state: State,
        { payload }: UserActions.PresenceUpdatedAction
    ) => {
        const presence = state.get(payload.user_id);
        if (presence) {
            if (payload.timestamp) {
                if (moment(payload.timestamp).isAfter(presence.timestamp)) {
                    return state.set(payload.user_id, presence.merge(payload));
                }
            } else {
                return state.set(payload.user_id, presence.merge(payload));
            }
        }
        return state;
    },
    [Actions.PRESENCE_LOST]: (
        state: State,
        { payload }: UserActions.PresenceLostAction
    ) => {
        return state.delete(payload.user_id);
    },
};

export default { state, reducers };
