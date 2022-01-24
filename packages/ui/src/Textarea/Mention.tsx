import React, { useState, useRef, useEffect, useContext } from "react";
import { Range, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import ReactPortal from "./Portal";
import ReactPopper from "../Popper";
import Elements from "../Elements";

export interface IMention {
    value: string;
    [key: string]: any;
}

export interface IMentions {
    prefix: string;
    selected?: number;
    mentions: IMention[];
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
}

export interface IMentionCollection<T = IMention> {
    sort?: (a: T, b: T) => 1 | -1 | 0;
    filter?: (value: T, search: string) => boolean;
    mentions: T[] | any;
}

export interface IMentionables {
    [key: string]: IMentionCollection;
}

export interface IBasePortal {
    prefix: string;
    subject: string;
    selected?: number;
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
    target: Range;
}

export interface IBasePopper {
    prefix: string;
    subject: string;
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
}

export interface IPopper {
    anchorEl?: HTMLElement | null;
    onSelect?: (e: any) => void;
}

export interface IPortal {
    onSelect?: (e: any) => void;
}

export const Context = React.createContext<IMentionables>({});

function useSubject() {
    const editor = useSlate();
    const [target, setTarget] = useState<Range | null>(null);
    const [prefix, setPrefix] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const mentionable = useContext(Context);
    const { selection } = editor;

    function clear() {
        if (Boolean(target)) {
            setTarget(null);
        }
        if (Boolean(prefix)) {
            setPrefix("");
        }
        if (Boolean(subject)) {
            setSubject("");
        }
    }
    useEffect(() => {
        if (selection && Range.isCollapsed(selection)) {
            const prefixes = Object.keys(mentionable);
            const preregexp = new RegExp(`^[${prefixes.join("")}](\\w+)$`);

            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
                beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(preregexp);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch && prefixes.length > 0) {
                const pre = beforeMatch[0][0];
                const word = beforeMatch[1];
                if (word != subject || pre != prefix) {
                    setSubject(word);
                    setPrefix(pre);
                    setTarget(beforeRange as any);
                }
            } else {
                clear();
            }
        }
    });

    return { subject, prefix, target };
}

function useMemtions(prefix: string, subject: string = "") {
    const mentionable = useContext(Context);
    const collection = mentionable[prefix];

    if (collection && Boolean(subject)) {
        let mentions: IMention[] = [];
        if (collection.filter) {
            mentions = (collection.mentions as any).filter((mention: any) =>
                // This looks nasty but its
                // typescript
                collection.filter!(mention, subject)
            );
        }
        if (collection.sort) {
            mentions = mentions.sort(collection.sort);
        }
        return mentions;
    }
}

function useControls(props: IPortal) {
    const [open, setOpen] = useState<boolean>(true);
    const { subject, target, prefix } = useSubject();

    useEffect(() => {
        if (subject === "") {
            setOpen(true);
        }
    }, [subject]);

    function handleClose() {
        setOpen(false);
    }

    // Close mentions before/after select or ***CRASH***
    function handleSelect(mention: IMention) {
        handleClose();
        props.onSelect!({ target, mention, subject, prefix });
    }

    return { open, handleSelect, handleClose, subject, target, prefix };
}

export function Mentions(props: IMentions) {
    const { mentions, prefix } = props;
    const [selected, setSelected] = React.useState<number>(-1);

    const Components = Elements.useElements();

    React.useEffect(() => {
        setSelected(props.selected ?? -1);
    }, [props.selected]);

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selected]);

    function calmEvent(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (["Enter", "Tab"].includes(event.key)) {
            calmEvent(event);
            if (selected < 0) {
                setSelected(0);
            } else if (selected > -1 && props.onSelect) {
                props.onSelect(props.mentions[selected]);
            }
        } else if (event.key == "Escape") {
            calmEvent(event);
            if (props.onClose) {
                props.onClose(event);
            }
        } else if (event.key == "ArrowUp") {
            calmEvent(event);
            setSelected((val) => (val > 0 ? val - 1 : val));
        } else if (event.key == "ArrowDown") {
            calmEvent(event);
            setSelected((val) => (val >= mentions.length - 1 ? 0 : val + 1));
        }
    }

    return (
        <React.Fragment>
            {mentions.map((mention, index) => {
                return (
                    <div
                        role="button"
                        key={String(index)}
                        onClick={() =>
                            props.onSelect ? props.onSelect(mention) : null
                        }
                        className="flex flex-col">
                        <Components.Mention
                            prefix={prefix}
                            mention={mention}
                            selected={selected == index}
                        />
                    </div>
                );
            })}
        </React.Fragment>
    );
}

export function BasePortal({ target, ...props }: IBasePortal) {
    const ref = useRef<HTMLDivElement | null>(null);
    const editor = useSlate();

    const mentions = useMemtions(props.prefix, props.subject);

    useEffect(() => {
        const el = ref.current;
        if (el && target && mentions && mentions.length > 0) {
            const domRange = ReactEditor.toDOMRange(editor, target);
            const rect = domRange.getBoundingClientRect();
            if (
                rect.top + el.getBoundingClientRect().height + 24 >
                window.innerHeight
            ) {
                el.style.top = `${
                    rect.top + window.pageYOffset - el.offsetHeight - 8
                }px`;
                el.style.left = `${
                    rect.left +
                    window.pageXOffset -
                    el.offsetWidth / 2 +
                    rect.width / 2
                }px`;
            } else {
                el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                el.style.left = `${rect.left + window.pageXOffset}px`;
            }
        }
    }, [mentions?.length, target, ref.current]);

    return (
        <ReactPortal>
            <div
                ref={ref}
                className="absolute flex min-w-[150px] flex-col max-h-56 p-2 border border-gray-200 shadow-lg rounded-md z-[2000] bg-white overflow-y-auto">
                <Mentions {...props} mentions={mentions!} />
            </div>
        </ReactPortal>
    );
}

export const BasePopper = ReactPopper.create<HTMLDivElement, IBasePopper>(
    (props) => {
        const mentions = useMemtions(props.prefix, props.subject);
        if (mentions && mentions.length > 0) {
            return (
                <ReactPopper
                    as={"ul"}
                    placement="top-start"
                    distance={10}
                    tabIndex={-1}
                    anchorEl={props.anchorEl}
                    onClickAway={props.onClickAway}
                    style={{ width: props.anchorEl?.clientWidth }}
                    className="z-10 flex w-full flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 p-2 bg-white shadow-md  overflow-x-hidden overflow-y-auto">
                    <Mentions {...props} mentions={mentions!} />
                </ReactPopper>
            );
        }
        return null;
    }
);

export function Portal(props: IPortal) {
    const { open, target, prefix, subject, handleClose, handleSelect } =
        useControls(props);

    if (target && open) {
        return (
            <BasePortal
                target={target}
                prefix={prefix}
                subject={subject}
                onClose={handleClose}
                onSelect={handleSelect}
            />
        );
    }
    return null;
}

export function Popper(props: IPopper) {
    const { open, prefix, subject, handleClose, handleSelect } =
        useControls(props);
    return (
        <BasePopper
            open={open && Boolean(subject.trim()) && Boolean(prefix)}
            prefix={prefix}
            onClose={handleClose}
            subject={subject}
            onSelect={handleSelect}
            anchorEl={props.anchorEl}
        />
    );
}

type TMention = typeof Portal & { Popper: typeof Popper, Context: typeof Context };

Portal.Popper = Popper;
Portal.Context = Context;

export default Portal as TMention;
