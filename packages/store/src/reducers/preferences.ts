import { PreferencesRecord } from "../records";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";
import * as AppActions from "../actions/app";

export const state = new PreferencesRecord();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.PREFERENCES_LOADED]: (
        state: PreferencesRecord,
        { payload }: UserActions.PreferencesLoadedAction
    ) => {
        return payload.reduce((store, pref) => {
            return store.set(pref.preference as any, pref.value);
        }, state);
    },
    [Actions.SET_AUTH]: (
        state: PreferencesRecord,
        { payload }: AppActions.AuthAction
    ) => {
        return payload.preferences.reduce((store, pref) => {
            return store.set(pref.preference as any, pref.value);
        }, state);
    },
    [Actions.PREFERENCE_SET]: (
        state: PreferencesRecord,
        { payload }: UserActions.PreferenceSetAction
    ) => {
        return state.set(payload.preference as any, payload.value);
    },
};

export default { state, reducers };
