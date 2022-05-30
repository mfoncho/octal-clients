import React, { useCallback, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import Elements from "../Elements";
import emoji from "@octal/emoji";
import cls from "classnames";
import UIEvent from "../event";
import { EventTarget, InputProps } from "./types";
import Suggestions, { useSuggesting } from "./Suggestion";
import Markdown, { Slater, nodes } from "@octal/markdown";
import { isEmojiActive, insertEmoji } from "./utils";
import { withPaste, wrap } from "./wrappers";
import { useReflection, useInput, useChangeHandler } from "./hooks";
import { Transforms, createEditor, Descendant } from "slate";

let slater = new Slater(new Markdown())
    .add(new nodes.Paragraph())
    .add(new nodes.Emoji())
    .add(new nodes.Text());

const pslater = new Slater(new Markdown())
    .add(new nodes.Emoji())
    .add(new nodes.Text());

const wrappers = [withReact, withPaste(pslater)];

interface InputClasses {
    focus?: string | null;
    height?: string | null;
    boarder?: string | null;
    padding?: string | null;
    classname?: string;
}

function filterout<T>(
    array: Array<T>,
    test: (val: T, index: number) => boolean
): [Array<T>, Array<T>] {
    return array.reduce(
        (acc, val, index) => {
            let [out, rest] = acc;
            if (test(val, index)) {
                out.push(val);
            } else {
                rest.push(val);
            }
            return [out, rest];
        },
        [[], []] as [Array<T>, Array<T>]
    );
}

export default function Input(props: InputProps) {
    const Component = Elements.useElements();

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

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key == "Enter") {
            event.preventDefault();
            if (suggesting[0] == false) {
                if (props.onSubmit) {
                    const target = {
                        files: [],
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

    function handleSuggestionSelected(selected: any) {
        if (selected.type == "emoji") {
            Transforms.select(editor, selected.target);
            insertEmoji(editor, selected.value.native);
        }
    }

    function handleFocused(event: React.FocusEvent<HTMLDivElement>) {
        if (props.onFocus) {
            props.onFocus(event);
        }
    }

    function handleUnfocused(event: React.FocusEvent<HTMLDivElement>) {
        if (props.onBlur) {
            props.onBlur(event);
        }
    }

    const classes = useMemo<InputClasses>(() => {
        let classes: InputClasses = {};
        let classnames = (props.className ?? "")
            .split(" ")
            .map((classname) => classname.trim());
        let [out, rest]: [string[], string[]] = [[], classnames];

        classes.focus = "";

        [out, rest] = filterout(rest, (classname) => {
            return classname.startsWith("p-");
        });

        if (out.length === 0) {
            [out, rest] = filterout(rest, (classname) => {
                return classname.startsWith("px");
            });
            if (out.length === 0) {
                classes.padding = "px-2";
            } else {
                classes.padding = out.join(" ");
            }
            [out, rest] = filterout(rest, (classname) => {
                return classname.startsWith("py");
            });
            if (out.length === 0) {
                classes.padding = [classes.padding ?? "", "py-1.5"].join(" ");
            } else {
                classes.padding = [classes.padding, ...out].join(" ");
            }
        } else {
            classes.padding = out.join(" ");
        }

        [out, rest] = filterout(rest, (classname) => {
            return classname.startsWith("border");
        });
        if (out.length === 0) {
            classes.boarder = "border";
        } else {
            classes.boarder = out.join(" ");
        }

        [out, rest] = filterout(rest, (classname) => {
            return classname.startsWith("min-h");
        });
        if (out.length === 0) {
            classes.height = "min-h-11";
        } else {
            classes.height = out.join(" ");
        }

        classes.classname = rest.join(" ");
        return classes;
    }, [props.className]);

    return (
        <Slate editor={editor} value={state.data} onChange={handleChange}>
            <Editable
                className={cls(
                    "rounded-md w-full",
                    classes.boarder,
                    classes.padding,
                    classes.height,
                    {
                        [classes.classname ?? ""]: Boolean(classes.classname),
                    }
                )}
                disabled={props.disabled}
                style={{ overflowWrap: "anywhere" }}
                onBlur={handleUnfocused}
                onFocus={handleFocused}
                autoFocus={props.autoFocus}
                onKeyDown={handleKeyDown}
                renderLeaf={renderLeaf}
                placeholder={props.placeholder}
                renderElement={renderElement}
            />
            <Suggestions.Popper
                anchorEl={state.currentTarget}
                suggesting={suggesting}
                onSelect={handleSuggestionSelected}
            />
        </Slate>
    );
}
