import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import Elements from "../Elements";
import emoji from "@octal/emoji";
import cls from "classnames";
import Suggestions, { useSuggesting } from "./Suggestion";
import Markdown, { Slater, nodes } from "@octal/markdown";
import { isEmojiActive, insertEmoji } from "./utils";
import { withPaste, wrap } from "./wrappers";
import { Transforms, createEditor, Descendant } from "slate";

let slater = new Slater(new Markdown())
    .add(new nodes.Paragraph())
    .add(new nodes.Emoji())
    .add(new nodes.Text());

const pslater = new Slater(new Markdown())
    .add(new nodes.Emoji())
    .add(new nodes.Text());

const wrappers = [withReact, withPaste(pslater)];

export interface IInput {
    className?: string;
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    autoFocus?: boolean;
    placeholder?: string;
    value: string;
    disabled?: boolean;
}

interface InputClasses {
    focus?: string | null;
    height?: string | null;
    boarder?: string | null;
    padding?: string | null;
    classname?: string;
}

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

export default function Input(props: IInput) {
    const Component = Elements.useElements();

    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const [focused, setFocused] = useState(false);

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

    useEffect(() => {
        let pvalue = props.value.split("\n").join(" ").trim();
        let ivalue = slater.serialize(value).trim();
        if (pvalue != ivalue) {
            let parsed = slater.parse(pvalue!);
            Transforms.deselect(editor);
            setValue(parsed as any);
            Transforms.select(editor, { path: [0, 0], offset: 0 });
        }
    }, [props.value]);

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

    function handleSuggestionSelected(selected: any) {
        if (selected.type == "emoji") {
            Transforms.select(editor, selected.target);
            insertEmoji(editor, selected.value.native);
        }
    }

    function handleFocused(event: React.FocusEvent<HTMLDivElement>) {
        setFocused(true);
        if (props.onFocus) {
            props.onFocus(event);
        }
    }

    function handleUnfocused(event: React.FocusEvent<HTMLDivElement>) {
        setFocused(false);
        if (props.onBlur) {
            props.onBlur(event);
        }
    }

    const classes = useMemo<InputClasses>(() => {
        let classes: InputClasses = {};
        let [out, rest] = filterout(
            (props.className ?? "")
                .split(" ")
                .map((classname) => classname.trim()),
            (classname) => classname.startsWith("focus:")
        );
        classes.focus =
            out.length > 0
                ? out
                      .map((classname) =>
                          classname.replace("focus:", "").trim()
                      )
                      .join(" ")
                : "";
        [out, rest] = filterout(rest, (classname) => {
            return classname.includes("p-");
        });

        if (out.length === 0) {
            [out, rest] = filterout(rest, (classname) => {
                return classname.includes("px");
            });
            if (out.length === 0) {
                classes.padding = "px-2";
            } else {
                classes.padding = out.join(" ");
            }
            [out, rest] = filterout(rest, (classname) => {
                return classname.includes("py");
            });
            if (out.length === 0) {
                classes.padding = [classes.padding ?? "", "py-1.5"].join(" ");
            }
        } else {
            classes.padding = out.join(" ");
        }

        [out, rest] = filterout(rest, (classname) => {
            return classname.includes("border");
        });
        if (out.length === 0) {
            classes.boarder = "border";
        } else {
            classes.boarder = out.join(" ");
        }

        [out, rest] = filterout(rest, (classname) => {
            return classname.includes("min-h");
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
        <Slate editor={editor} value={value} onChange={handleChange}>
            <div
                ref={rootRef}
                className={cls(
                    classes.boarder,
                    classes.padding,
                    classes.height,
                    {
                        [`${classes.focus} border-primary-400`]: focused,
                    },
                    {
                        [classes.classname ?? ""]: Boolean(classes.classname),
                    },
                    "rounded-md"
                )}>
                <Editable
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
                    anchorEl={rootRef.current}
                    suggesting={suggesting}
                    onSelect={handleSuggestionSelected}
                />
            </div>
        </Slate>
    );
}
