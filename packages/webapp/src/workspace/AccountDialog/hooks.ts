import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "@octal/client";
import { PreferencesRecord, UserRecord } from "@octal/store";
import * as UserActions from "@octal/store/lib/actions/user";
import { usePreferences } from "@octal/store/lib/hooks";

export type PreferenceT = keyof io.Preferences;

export type SetPreferenceType = (
    key: PreferenceT,
    value: string | boolean | number
) => void;

export interface IPreference {
    user: UserRecord;
    loading: boolean;
    preference: PreferencesRecord;
    setPreference: SetPreferenceType;
}

export interface IChanges extends Partial<io.Preferences> {}

export const noop = () => {};

export function useActions(): [PreferencesRecord, SetPreferenceType, boolean] {
    const dispatch = useDispatch();

    const preferences = usePreferences();

    const [loading, setLoading] = useState(false);

    const [changes, setChanges] = useState<IChanges>({});

    useEffect(() => {
        if (Object.keys(changes).length > 0) {
            dispatch(UserActions.updatePreferences(changes))
                .then(() => setChanges({}))
                .catch(() => {})
                .finally(() => setLoading(false));
            setLoading(true);
        }
    }, [changes]);

    function setPreference(key: PreferenceT, value: string | boolean | number) {
        if (preferences.get(key) == value && key in changes) {
            setChanges((changes) => {
                let pref = { ...changes };
                delete pref[key];
                return pref;
            });
        } else if (preferences.get(key) != value) {
            setChanges((changes) => ({ ...changes, [key]: value }));
        }
    }

    return [preferences, setPreference, loading];
}
