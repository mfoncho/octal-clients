import React from "react";
import { colors } from "src/theme";
import { noop, IPreference } from "./hooks";

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
                <input
                    key={key}
                    onChange={noop}
                    checked={props.preferences.get(preference) == key}
                    onClick={handleSetTheme(key)}
                    type="checkbox"
                    className="form-checkbox border-transparent m-2 w-8 h-8 rounded-full"
                    style={{
                        backgroundColor: palette["700"],
                    }}
                />
            );
        }
    }
    return (
        <div className="flex flex-row flex-wrap py-8">
            {Object.keys(colors).map(renderColor)}
        </div>
    );
});
