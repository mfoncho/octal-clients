import React from "react";
import { Dialog } from "@octal/ui";
import { useActions } from "./hooks";
import { UserRecord } from "@octal/store";
import ThemePreference from "./ThemePreference";
import LanguagePreference from "./LanguagePreference";
//import MessagePreference from "./MessagePreference";
//import ThemeModePreference from "./ThemeModePreference";

export interface IPreferences {
    user: UserRecord;
    setView: React.Dispatch<React.SetStateAction<string>>;
}

export default React.memo<IPreferences>((props) => {
    const [preferences, setPreference, loading] = useActions();

    return (
        <Dialog.Content className="overflow-y-auto space-y-4">
            {/**
            <MessagePreference
                user={props.user}
                loading={loading}
                preferences={preferences}
                setPreference={setPreference}
            />
            <ThemeModePreference
                user={props.user}
                loading={loading}
                preferences={preferences}
                setPreference={setPreference}
            />
            **/}
            <ThemePreference
                user={props.user}
                loading={loading}
                preferences={preferences}
                setPreference={setPreference}
            />
            <LanguagePreference
                user={props.user}
                loading={loading}
                preferences={preferences}
                setPreference={setPreference}
            />
        </Dialog.Content>
    );
});
