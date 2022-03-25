import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import Elements from "../Elements";
import emoji from "@octal/emoji";
import isHotkey from "is-hotkey";
import Toolbar from "./Toolbar";
import markdown from "@octal/markdown";
import Mention from "./Mention";
import { Slater } from "@octal/markdown";
import {
    wrap,
    withEmoji,
    withMention,
    withTables,
    withShortcuts,
} from "./wrappers";
import {
    toggleFormat,
    isEmojiActive,
    insertMention,
    toggleMark,
} from "./utils";
import { Transforms, Editor, createEditor, Descendant } from "slate";

const slater = Slater.create();

const wrappers = [withReact, withEmoji, withMention, withTables, withShortcuts];

export interface IMention {
    value: string;
    [key: string]: any;
}

export interface IMentionCollection<T = IMention> {
    sort?: (a: T, b: T) => 1 | -1 | 0;
    filter?: (value: T, search: string) => boolean;
    mentions: T[] | any;
}

export interface IMentionable {
    [key: string]: IMentionCollection;
}

export interface ITextarea {
    onChange?: (value: string) => void;
    className?: string;
    onBlur?: (event: any) => void;
    autoFocus?: boolean;
    placeholder?: string;
    value: string;
}

export const Mentionable = React.createContext<IMentionable>({});

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

    useEffect(() => {
        const { value } = props;
        if (Boolean(value)) {
            setValue(slater.parse(value!) as any);
        }
    }, [props.value]);

    function handleMentionSelected({ target, mention }: any) {
        Transforms.select(editor, target as any);
        insertMention(editor, mention.value);
    }

    function handleChange(value: any) {
        setValue(value);
        const text = slater.serialize(value).trim();
        if (text != value && props.onChange) {
            props.onChange(text);
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
        if (event.key == "Enter") {
            event.preventDefault();
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
                <Mention onSelect={handleMentionSelected} />
            </div>
        </Slate>
    );
}
