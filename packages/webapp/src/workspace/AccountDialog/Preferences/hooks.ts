import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Preference,
    PreferencesRecord,
    UserRecord,
    usePreferences,
} from "@octal/store";
import * as UserActions from "@octal/store/lib/actions/user";

export type SetPreferenceType = (
    key: Preference,
    value: string | boolean | number
) => void;

export interface IPreference {
    user: UserRecord;
    loading: boolean;
    preferences: PreferencesRecord;
    setPreference: SetPreferenceType;
}

export const noop = () => {};

export function useActions(): [PreferencesRecord, SetPreferenceType, boolean] {
    const dispatch = useDispatch();

    const preferences = usePreferences();

    const [loading] = useState(false);

    function setPreference(key: Preference, value: string | boolean | number) {
        if (preferences.get(key) !== value) {
            return dispatch(UserActions.setPreference(key, value));
        }
        return Promise.resolve({ preferences: key, value: value });
    }

    return [preferences, setPreference, loading];
}
