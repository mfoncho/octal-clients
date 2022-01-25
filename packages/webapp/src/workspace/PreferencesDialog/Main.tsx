import React, { useEffect, useState } from "react";
import clx from "classnames";
import { useDispatch } from "react-redux";
import { Dialog, Button, Flow } from "@octal/ui";
import Message from "../Message";
import { io } from "@octal/client";
import colors from "src/colors";
import { usePreferences, useUser } from "@octal/store/lib/hooks";
import { MessageRecord } from "@octal/store/lib/records";
import { updatePreferences } from "@octal/store/lib/actions/user";

interface IDialog {}

const noop = () => undefined;

type PreferenceT = keyof io.Preferences;

interface ILocale {
    value: string;
    onChange: (key: PreferenceT, value: string) => any;
}

interface IThemeMode {
    value: string;
    onChange: (key: PreferenceT, value: string) => any;
}

interface IChanges extends Partial<io.Preferences> {}

const Locale = React.memo<ILocale>((props) => {
    function handleSetLocale(event: React.ChangeEvent<{ value: unknown }>) {
        event.stopPropagation();
        event.preventDefault();
        props.onChange("locale", event.target.value as string);
    }
    return (
        <div className="flex flex-col py-6">
            <div className="mt-1 relative flex flex-col">
                <select
                    onChange={handleSetLocale}
                    className="block appearance-none border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                <div className="absolute h-full flex inset-y-0 items-center px-3 right-0 text-gray-700 bg-primary-300 rounded-r pointer-events-none">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
});

const ThemeMode = React.memo<IThemeMode>((props) => {
    function handleSetThemeMode(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            props.onChange("theme_mode", type);
        };
    }
    function renderMode(mode: string) {
        const label = mode == "light" ? "Light" : "Dark";
        return (
            <div
                role="button"
                key={mode}
                className="flex my-1 flex-row p-2 rounded-md hover:bg-gray-200 items-center cursor-pointer"
                onClick={handleSetThemeMode(mode)}>
                <input
                    type="checkbox"
                    className="form-checkbox rounded-full mx-2"
                    onChange={noop}
                    checked={mode == props.value}
                />
                <span className="text-base text-gray-600 font-semibold">
                    {label}
                </span>
            </div>
        );
    }
    return (
        <div className="flex flex-col py-4">
            <span className="py-2 font-semibold text-gray-800">Mode</span>
            <div className="flex flex-col bg-gray-100 rounded-md p-2">
                {renderMode("light")}
                {renderMode("dark")}
            </div>
        </div>
    );
});

type ColorT = keyof typeof colors;

const ThemeColor = React.memo<IThemeMode>((props) => {
    function handleSetTheme(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            props.onChange("theme", type);
        };
    }
    return (
        <div className="flex flex-row flex-wrap py-8">
            {Object.keys(colors).map((color) => (
                <input
                    onChange={noop}
                    checked={props.value == color}
                    onClick={handleSetTheme(color)}
                    key={color}
                    type="checkbox"
                    className="form-checkbox border-transparent m-2 w-8 h-8 rounded-full"
                    style={{
                        backgroundColor: colors[color as ColorT]["A400"],
                    }}
                />
            ))}
        </div>
    );
});

const MessageType = React.memo<IThemeMode>((props) => {
    const user = useUser();
    const sampleMessage = new MessageRecord({
        id: "0",
        user_id: user.id,
        timestamp: new Date().toISOString(),
        markdown: false,
        content:
            "Hello does this formating sout you? and hope this message will wrap around somehow please do",
    });

    function handleSetMessageType(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            props.onChange("message_type", type);
        };
    }

    const options = [
        { name: "Default", value: "default" },
        { name: "Compact", value: "compact" },
    ];

    return (
        <div className="flex flex-col py-6">
            <div className="flex flex-col rounded-md my-1 p-2 bg-gray-100">
                {options.map((option) => (
                    <div
                        role="button"
                        key={option.value}
                        className="flex my-1 flex-row p-2 rounded hover:bg-gray-200 items-center cursor-pointer"
                        onClick={handleSetMessageType(option.value)}>
                        <input
                            type="checkbox"
                            className="form-checkbox rounded-full mx-2"
                            onChange={noop}
                            checked={option.value == props.value}
                        />
                        <span className="text-base text-gray-600 font-semibold">
                            {option.name}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col my-4 py-4 hover:bg-gray-100 rounded-md border-2 border-gray-100 overflow-hidden">
                <Message extra={true} tsformat="LT" message={sampleMessage} />
            </div>
        </div>
    );
});

const tabs = [
    { name: "Theme", value: "theme" },
    { name: "Message", value: "message" },
    { name: "Language", value: "language" },
];

export default Dialog.create<IDialog>((props) => {
    const dispatch = useDispatch();

    const [_loading, setLoading] = useState(false);

    const [preference, setPreference] = useState("theme");

    const preferences = usePreferences();

    const [changes, setChanges] = useState<IChanges>({});

    function handleSetPreference(
        key: PreferenceT,
        value: string | boolean | number
    ) {
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

    function handleSwitchPreference(preference: string) {
        return () => {
            setPreference(preference);
        };
    }
    useEffect(() => {
        if (Object.keys(changes).length > 0) {
            dispatch(updatePreferences(changes))
                .then(() => setChanges({}))
                .catch(() => {})
                .finally(() => setLoading(false));
            setLoading(true);
        }
    }, [changes]);

    return (
        <Dialog
            open={props.open}
            fullHeight={true}
            title="User Preferences"
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col max-h-[700px] overflow-hidden">
                <div className="flex flex-row items-center">
                    {tabs.map((tab) => (
                        <div key={tab.value} className="flex flex-col mr-4">
                            <Button
                                key={tab.value}
                                color="clear"
                                onClick={handleSwitchPreference(tab.value)}>
                                {tab.name}
                            </Button>
                            <div
                                className={clx(
                                    "h-1 rounded-t-md",
                                    preference == tab.value && "bg-primary-500"
                                )}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col px-4 overflow-y-auto overflow-x-hidden">
                    <Flow.Switch value={preference}>
                        <Flow.Case value="theme">
                            <ThemeMode
                                value={
                                    changes.theme_mode
                                        ? changes.theme_mode
                                        : preferences.theme_mode
                                }
                                onChange={handleSetPreference}
                            />
                            <ThemeColor
                                value={
                                    changes.theme
                                        ? changes.theme
                                        : preferences.theme
                                }
                                onChange={handleSetPreference}
                            />
                        </Flow.Case>
                        <Flow.Case value="message">
                            <MessageType
                                value={
                                    changes.message_type
                                        ? changes.message_type
                                        : preferences.message_type
                                }
                                onChange={handleSetPreference}
                            />
                        </Flow.Case>
                        <Flow.Case value="language">
                            <Locale
                                value={
                                    changes.locale
                                        ? changes.locale
                                        : preferences.locale
                                }
                                onChange={handleSetPreference}
                            />
                        </Flow.Case>
                    </Flow.Switch>
                </div>
            </Dialog.Content>
        </Dialog>
    );
});
