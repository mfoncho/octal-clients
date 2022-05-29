import React from "react";
import emoji from "@octal/emoji";
import { ReactEditor } from "slate-react";
import { Transforms, Descendant, Editor, Path } from "slate";
import UIEvent from "../event";
import isHotkey from "is-hotkey";
import {
    fileinfo,
    insertEmoji,
    isBlockActive,
    insertMention,
    isMarkActive,
    toggleMark,
    toggleBlock,
    isEmojiActive,
} from "./utils";
import { InputProps, EditorState, State, EventTarget } from "./types";

import { Slater } from "@octal/markdown";

const initialData: Descendant[] = [
    {
        type: "paragraph",
        children: [
            {
                text: "",
            },
        ],
    },
];

const initialState: State = {
    value: "",
    files: [],
    data: initialData,
};

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+`": "code",
    "shift+enter": "new_line",
};

export function useReflection(
    editor: Editor,
    input: EditorState,
    props: InputProps,
    slater: Slater
) {
    const [state, setState] = input;

    React.useEffect(() => {
        if (props.data) {
            const data = props.data.length == 0 ? initialData : props.data!;
            const value = slater.serialize(data).trim();
            setState((state) => ({ ...state, data, value }));
        }
    }, [props.data]);

    React.useEffect(() => {
        let value = (props.value ?? "").trim();
        if (value != state.value.trim()) {
            let data = slater.parse(value!);
            setState((state) => ({ ...state, value, data }));
        }
    }, [props.value]);

    React.useEffect(() => {
        if (props.value !== undefined && props.value !== null) {
            const value = props.value.trim();
            if (state.value.trim() !== value) {
                let data = slater.parse(props.value);
                let node, path;
                const { selection } = editor;
                Transforms.deselect(editor);
                if (selection) [node, path] = Editor.node(editor, selection);
                if (node && path && selection) {
                    if (Path.equals(path, ReactEditor.findPath(editor, node))) {
                        //@ts-ignore
                        if (node.text && node.text[selection.anchor.offset])
                            Transforms.select(editor, selection);
                        else {
                            //@ts-ignore
                            const offset = Boolean(node.text)
                                ? //@ts-ignore
                                  node.text.length - 1
                                : 0;
                            Transforms.select(editor, {
                                anchor: {
                                    ...selection.anchor,
                                    offset,
                                },
                                focus: {
                                    ...selection.focus,
                                    offset,
                                },
                            });
                        }
                    }
                }
                setState((state) => ({
                    ...state,
                    data,
                    value,
                }));
            }
        }
    }, [state.data]);
}

export function useInput(editor: Editor) {
    const input = React.useState<State>(initialState);

    React.useEffect(() => {
        const currentTarget = ReactEditor.toDOMNode(
            editor,
            editor
        ) as HTMLDivElement;
        input[1]((state) => ({ ...state, currentTarget }));
    }, []);
    return input;
}

export function useChangeHandler(
    editor: Editor,
    input: EditorState,
    props: InputProps,
    slater: Slater
) {
    const [state, setState] = input;
    return React.useCallback(
        (data: Descendant[]) => {
            const { files, currentTarget } = state;
            const value = slater.serialize(data).trim();
            setState((state) => ({ ...state, value, data }));
            if (props.onChange && value !== state.value) {
                const event = UIEvent.synthesis(
                    UIEvent.event("change", { currentTarget })
                );
                const target = {
                    files,
                    value,
                    editor,
                    data,
                };
                const uievent = UIEvent.create<EventTarget>(
                    target,
                    event,
                    "change"
                );
                props.onChange(uievent);
            }
        },
        [state.value, state.files, state.currentTarget]
    );
}

export function useKeyDownHandler(
    editor: Editor,
    state: State,
    submitable: boolean,
    props: InputProps
) {
    return function handleKeyDown(event: React.KeyboardEvent) {
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
            if (submitable && props.onSubmit) {
                const target = {
                    files: state.files,
                    value: state.value,
                    editor,
                    data: state.data,
                };
                const uievent = UIEvent.create<EventTarget>(
                    target,
                    event,
                    "submit"
                );
                props.onSubmit(uievent);
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
    };
}