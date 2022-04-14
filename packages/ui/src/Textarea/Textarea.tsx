import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import Elements from "../Elements";
import emoji from "@octal/emoji";
import isHotkey from "is-hotkey";
import Toolbar from "./Toolbar";
import Suggestions, { useSuggesting } from "./Suggestion";
import { Slater } from "@octal/markdown";
import {
    withPaste,
    wrap,
    withMention,
    withTables,
    withLink,
    withShortcuts,
} from "./wrappers";
import {
    toggleFormat,
    isEmojiActive,
    insertEmoji,
    insertMention,
    toggleMark,
} from "./utils";

import { Transforms, Editor, createEditor, Descendant } from "slate";

const slater = Slater.create();

const wrappers = [
    withReact,
    withPaste(slater),
    withLink,
    withMention,
    withTables,
    withShortcuts,
];

export interface ITextarea {
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    className?: string;
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    autoFocus?: boolean;
    placeholder?: string;
    value: string;
    disabled?: boolean;
}

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+`": "code",
    "shift+enter": "new_line",
};

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            {
                text: "",
            },
        ],
    },
];

export default function Textarea(props: ITextarea) {
    const Component = Elements.useElements();

    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const suggesting = useSuggesting();

    const renderLeaf = useCallback(
        (props) => <Component.Leaf {...props} />,
        [Component.Leaf]
    );

    const renderElement = useCallback(
        (props) => <Component.Element {...props} />,
        [Component.Element]
    );

    const editor = useMemo(() => wrap(createEditor(), wrappers), []);

    const [value, setValue] = useState<Descendant[]>(initialValue);

    console.log(value);
    useEffect(() => {
        const { value } = props;
        if (Boolean(value)) {
            const slated = slater.parse(value!);
            setValue(slated as any);
            Transforms.deselect(editor);
            setValue(slated as any);
            Transforms.select(editor, { path: [0, 0], offset: 0 });
        }
    }, [props.value]);

    function handleSuggestionSelected(selected: any) {
        if (selected.type == "mention") {
            Transforms.select(editor, selected.target);
            insertMention(editor, selected.value.value);
        } else if (selected.type == "emoji") {
            Transforms.select(editor, selected.target);
            insertEmoji(editor, selected.value.native);
        }
    }

    function handleChange(val: any) {
        setValue(val);
        if (props.onChange) {
            const text = slater.serialize(val).trim();
            const prev = slater.serialize(value).trim();
            if (text != prev) {
                props.onChange(text);
            }
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                if (mark == "new_line") {
                    return Editor.insertBreak(editor);
                } else {
                    return toggleMark(editor, mark);
                }
            }
        }

        // Submit if mention dialog is closed
        if (event.key == "Enter" && suggesting[0] === false) {
            event.preventDefault();
            if (props.onSubmit) {
                const text = slater.serialize(value).trim();
                props.onSubmit(text);
            }
            return;
        }

        if (emoji.test(event.key)) {
            event.preventDefault();
            const icon = emoji.image(event.key);
            return Transforms.insertFragment(editor, {
                icon,
                emoji: true,
                text: event.key,
            } as any);
        }

        if (event.key.length == 1 && isEmojiActive(editor)) {
            // Insert new character on new block
            event.preventDefault();
            return Transforms.insertFragment(editor, [
                {
                    text: event.key,
                },
            ] as any);
        }
    }

    return (
        <Slate editor={editor} value={value} onChange={handleChange}>
            <div ref={rootRef} className={props.className}>
                <Toolbar />
                <Editable
                    disabled={props.disabled}
                    onBlur={props.onBlur}
                    onKeyDown={handleKeyDown}
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
