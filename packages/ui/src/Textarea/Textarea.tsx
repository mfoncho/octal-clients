import React, { useCallback, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import Elements from "../Elements";
import Toolbar from "./Toolbar";
import Suggestions, { useSuggesting } from "./Suggestion";
import {
    useInput,
    useKeyDownHandler,
    useChangeHandler,
    useReflection,
} from "./hooks";
import { InputProps } from "./types";
import { Slater } from "@octal/markdown";
import {
    withPaste,
    wrap,
    withMention,
    withTables,
    withLink,
    withShortcuts,
} from "./wrappers";
import { toggleFormat, insertEmoji, insertMention } from "./utils";

import { Transforms, createEditor } from "slate";

const slater = Slater.create();

const wrappers = [
    withReact,
    withPaste(slater),
    withLink,
    withMention,
    withTables,
    withShortcuts,
];

export default function Textarea(props: InputProps) {
    const Component = Elements.useElements();

    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const suggesting = useSuggesting();

    const renderLeaf = useCallback(
        (props: any) => <Component.Leaf {...props} />,
        [Component.Leaf]
    );

    const renderElement = useCallback(
        (props: any) => <Component.Element {...props} />,
        [Component.Element]
    );

    const editor = useMemo(() => wrap(createEditor(), wrappers), []);

    const input = useInput(editor);

    const [state] = input;

    useReflection(editor, input, props, slater);

    const handleChange = useChangeHandler(editor, input, props, slater);

    const keyDownHandler = useKeyDownHandler(
        editor,
        state,
        suggesting[0] === false,
        props
    );

    function handleSuggestionSelected(selected: any) {
        if (selected.type == "mention") {
            Transforms.select(editor, selected.target);
            insertMention(editor, selected.value.value);
        } else if (selected.type == "emoji") {
            Transforms.select(editor, selected.target);
            insertEmoji(editor, selected.value.native);
        }
    }

    return (
        <Slate editor={editor} value={state.data} onChange={handleChange}>
            <div ref={rootRef} className={props.className}>
                <Toolbar />
                <Editable
                    disabled={props.disabled}
                    onBlur={props.onBlur}
                    onKeyDown={keyDownHandler}
                    renderLeaf={renderLeaf}
                    autoFocus={props.autoFocus}
                    placeholder={props.placeholder}
                    renderElement={renderElement}
                    onDOMBeforeInput={(event: InputEvent) => {
                        switch (event.inputType) {
                            case "formatBold":
                                event.preventDefault();
                                return toggleFormat(editor, "bold");
                            case "formatItalic":
                                event.preventDefault();
                                return toggleFormat(editor, "italic");
                            case "formatUnderline":
                                event.preventDefault();
                                return toggleFormat(editor, "underlined");
                        }
                    }}
                />
                <Suggestions
                    onSelect={handleSuggestionSelected}
                    suggesting={suggesting}
                />
            </div>
        </Slate>
    );
}
