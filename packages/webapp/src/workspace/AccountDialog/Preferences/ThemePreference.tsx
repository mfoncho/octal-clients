import React from "react";
import { colors } from "src/theme";
import * as Icons from "@octal/icons";
import { IPreference } from "./hooks";

const preference = "webapp.theme.color";

export default React.memo<IPreference>((props) => {
    function handleSetTheme(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            props.setPreference(preference, type);
        };
    }

    function renderColor(key: string) {
        //@ts-ignore
        let palette = colors[key as any];
        if (typeof palette === "object") {
            return (
                <div
                    key={key}
                    className="flex flex-row min-w-[10rem] h-32 rounded-md shadow overflow-hidden border border-slate-300">
                    <div
                        className="w-1/4"
                        style={{
                            backgroundColor: palette["700"],
                        }}></div>
                    <div className="flex-1 bg-slate-200 flex-row p-3 flex justify-end">
                        <button
                            onClick={handleSetTheme(key)}
                            className="flex bg-white w-6 h-6 rounded-full justify-center items-center">
                            {props.preferences.get(preference) == key && (
                                <Icons.CheckedDot className="w-6 h-6 text-primary-700" />
                            )}
                        </button>
                    </div>
                </div>
            );
        }
    }
    return (
        <div className="flex flex-row py-8 space-x-4 overflow-y-auto">
            {Object.keys(colors).map(renderColor)}
        </div>
    );
});
