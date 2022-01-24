import { PreferencesRecord } from "../records";
import { PREFERENCES_UPDATED } from "../actions/types";
import * as UserActions from "../actions/user";

export const state = new PreferencesRecord();

export const reducers = {
    [PREFERENCES_UPDATED]: (
        state: PreferencesRecord,
        { payload }: UserActions.PreferencesUpdatedAction
    ) => {
        return state.merge(payload);
    },
};

export default { state, reducers };
