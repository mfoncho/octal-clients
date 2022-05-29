import React from "react";
import cls from "classnames";
import * as Icons from "@octal/icons";
import { isFormatActive, toggleFormat } from "./utils";
import { useSlate } from "slate-react";

export type Icon = React.FC<React.SVGAttributes<HTMLOrSVGElement>>;

const icons = {
    bold: Icons.Editor.Bold as Icon,
    italic: Icons.Editor.Italic as Icon,
    strike: Icons.Editor.Strike as Icon,
};

export interface IFormatButton {
    icon: string;
    format: keyof typeof icons;
}

export default function FormatButton({ format }: IFormatButton) {
    const editor = useSlate();
    const Icon = icons[format]!;
    return (
        <button
            className="p-1 rounded-md"
            onMouseDown={(event) => {
                event.preventDefault();
                toggleFormat(editor, format);
            }}>
            <Icon
                className={cls(
                    "h-6 w-7",
                    isFormatActive(editor, format)
                        ? "text-white"
                        : "text-gray-400"
                )}
            />
        </button>
    );
}
