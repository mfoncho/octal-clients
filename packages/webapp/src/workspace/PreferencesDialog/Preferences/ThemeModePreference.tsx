import React from "react";
import { IPreference, noop } from "./hooks";

export default function ThemeModePreference(props: IPreference) {
    const { preferences: preference, setPreference } = props;

    function handleSetThemeMode(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setPreference("theme_mode", type);
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
                    checked={mode == preference.theme_mode}
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
}
