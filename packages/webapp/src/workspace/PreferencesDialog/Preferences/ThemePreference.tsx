import React from "react";
import colors from "src/colors";
import { noop, IPreference } from "./hooks";

type ColorT = keyof typeof colors;

export default React.memo<IPreference>((props) => {
    function handleSetTheme(type: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            props.setPreference("theme", type);
        };
    }
    return (
        <div className="flex flex-row flex-wrap py-8">
            {Object.keys(colors).map((color) => (
                <input
                    onChange={noop}
                    checked={props.preferences.theme == color}
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
