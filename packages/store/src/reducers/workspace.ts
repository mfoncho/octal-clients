import { Map } from "immutable";
import * as Actions from "../actions/types";

export type WorkspacesState = Map<string, any>;

const state = Map() as WorkspacesState;

export const reducers = {
    [Actions.WORKSPACE_LOADED]: (_state: WorkspacesState, { payload }: any) => {
        return Map<string, any>(payload) as WorkspacesState;
    },

    [Actions.WORKSPACE_UPDATED]: (
        _state: WorkspacesState,
        { payload }: any
    ) => {
        return state.merge(payload) as WorkspacesState;
    },
};

export default { state, reducers };
