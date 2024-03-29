import React from "react";
import emoji from "@colab/emoji";
import { ReactEditor } from "slate-react";
import { Transforms, Descendant, Editor, Path, Text } from "slate";
import UIEvent from "../event";
import isHotkey from "is-hotkey";
import { clearEditor, toggleMark, isEmojiActive } from "./utils";
import { InputProps, EditorState, State, EventTarget } from "./types";

import { Slater } from "@colab/markdown";

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
        if (props.value === undefined || props.value === null) return;
        let value = (props.value ?? "").split("\r\n").join("\n").trim();
        if (value != state.value.trim()) {
            let data = slater.parse(value!);
            const { selection } = editor;
            Transforms.deselect(editor);
            clearEditor(editor);
            Transforms.removeNodes(editor, { at: [0] });
            Transforms.insertNodes(editor, data);
            if (selection) {
                const end = Editor.end(editor, [data.length - 1]);
                const [node, path] = Editor.node(editor, {
                    anchor: end,
                    focus: end,
                });

                if (Text.isText(node)) {
                    const offset = node.text.trim().length;
                    Transforms.select(editor, {
                        anchor: {
                            path,
                            offset,
                        },
                        focus: {
                            path,
                            offset,
                        },
                    });
                }

                if (value == "") {
                    Transforms.setNodes(editor, { type: "paragraph" });
                    Editor.removeMark(editor, "code");
                    Editor.removeMark(editor, "bold");
                    Editor.removeMark(editor, "italic");
                }
            }
            setState((state) => ({
                ...state,
                value,
                data,
                files: props.files ?? state.files,
            }));
        }
    }, [props.value, state.value]);

    React.useEffect(() => {
        if (Boolean(props.files) && props.files !== state.files) {
            setState((state) => ({ ...state, files: props.files! }));
        }
    }, [props.files]);
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
    return (data: Descendant[]) => {
        const { files, currentTarget } = state;
        const value = slater.serialize(data);
        setState((state) => ({ ...state, value, data }));
        if (
            props.onChange &&
            value !== props.value &&
            value.trim() !== state.value.trim()
        ) {
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
    };
}

export function useKeyDownHandler(
    editor: Editor,
    state: State,
    submitable: boolean,
    props: InputProps
) {
    return function handleKeyDown(event: React.KeyboardEvent) {
        if (props.disabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
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
