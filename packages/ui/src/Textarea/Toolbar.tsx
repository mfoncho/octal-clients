import React, { useRef, useEffect } from "react";
import Portal from "./Portal";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import FormatButton from "./FormatButton";

export default function Toolbar() {
    const ref = useRef<HTMLDivElement | null>(null);
    const editor = useSlate();

    useEffect(() => {
        const el = ref.current;
        const { selection } = editor;

        if (!el) {
            return;
        }

        if (
            !selection ||
            !ReactEditor.isFocused(editor) ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ""
        ) {
            el.removeAttribute("style");
            return;
        }

        const domSelection = window.getSelection()!;
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
        el.style.left = `${
            rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
        }px`;
    });

    return (
        <Portal>
            <div
                className="absolute rounded-md flex flex-row z-[2000] bg-gray-800 shadow-lg"
                ref={ref}>
                <FormatButton format="bold" icon="format_bold" />
                <FormatButton format="italic" icon="format_italic" />
                <FormatButton format="strike" icon="format_strike" />
            </div>
        </Portal>
    );
}
