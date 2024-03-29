import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { Range, Editor } from "slate";
import emoji from "@colab/emoji";
import { ReactEditor, useSlate } from "slate-react";
import Elements from "../Elements";
import ReactPortal from "./Portal";
import ReactPopper from "../Popper";
import { useDebounce } from "@colab/hooks";

export interface ISuggestion {
    value: string;
    [key: string]: any;
}

export interface ArrayLike<T = any> {
    map: <S = any>(cb: (val: T, index: number) => S) => ArrayLike<S>;
}

export interface ISuggestions {
    term: string;
    type: string;
    suggestion: string;
    values: ISuggestion[];
    selected?: number;
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
}

export interface ISuggestable<T = any> {
    type: string;
    pattern: string;
    suggest: (query: string) => Promise<T[]>;
}
export interface ISuggestables<T = any> {
    [key: string]: ISuggestable<T>;
}

export interface ISubject {
    type: string;
    term: string;
    suggestion: string;
    target: Range | null;
}

export interface IBasePortal {
    subject: ISubject;
    selected?: number;
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
}

export interface IBasePopper {
    subject: ISubject;
    onSelect?: (e: any) => void;
    onClose?: (e: KeyboardEvent) => void;
}

export interface ISuggestionBase {
    suggesting?: ReturnType<typeof useSuggesting>;
    onSelect?: (e: any) => void;
}

export interface IPopper extends ISuggestionBase {
    anchorEl?: HTMLElement | null;
}

export interface IPortal extends ISuggestionBase {}

type Dispatch<T> = [T, (val: T) => void | ((val: () => T) => void)];

export const Suggesting = React.createContext<Dispatch<boolean>>([
    false,
    null,
] as any);

export const Context = React.createContext<ISuggestables>({
    emoji: emoji.suggestable,
});

const subjectDefault: ISubject = {
    suggestion: "",
    type: "",
    target: null,
    term: "",
};

const nomatch = new RegExp("$^");

export function useSuggesting() {
    return React.useState<boolean>(false);
}

function useSubject() {
    const editor = useSlate();
    const context = useContext(Context);
    const [subject, setSubject] = useState<ISubject>(subjectDefault);

    function clear() {
        if (Boolean(subject.target) || Boolean(subject.term)) {
            setSubject(subjectDefault);
        }
    }

    useEffect(() => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const patterns = Object.keys(context).map((key) => {
                return `(?<${key}>${context[key].pattern})`;
            });
            const pattern =
                patterns.length > 0
                    ? new RegExp(`^${patterns.join("|")}$`)
                    : nomatch;

            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
                beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(pattern);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
                const groups = beforeMatch.groups ?? {};
                const suggestion = Object.keys(groups).find((key) =>
                    Boolean(groups[key])
                )!;
                const target = beforeRange;
                const term = groups[suggestion];
                if (term != subject.term) {
                    const type = context[suggestion].type;
                    setSubject({
                        type,
                        term,
                        target,
                        suggestion,
                    });
                }
            } else {
                clear();
            }
        }
    });

    return subject;
}

function useSuggestions(subject: ISubject) {
    const suggestionable = useContext(Context);
    const search = suggestionable[subject.suggestion];

    return useMemo(() => {
        if (search && subject.term.length > 0) {
            return search.suggest(subject.term);
        }
        return Promise.resolve([]);
    }, [search, subject.term, subject.type]);
}

function useControls(props: IPortal) {
    const [open, setOpen] = useState<boolean>(true);
    const subject = useSubject();

    const term = useDebounce(
        subject.term,
        subject.term.length > 2 ? 700 : 1200
    );

    useEffect(() => {
        if (term === "") {
            setOpen(true);
        }
    }, [term]);

    function handleClose() {
        setOpen(() => false);
    }

    // Close suggestions before/after select or ***CRASH***
    function handleSelect(value: any) {
        handleClose();
        props.onSelect!({ ...subject, value });
    }

    return useMemo(() => {
        return { open, handleSelect, handleClose, subject };
    }, [term, subject.type]);
}

export function Suggestions(props: ISuggestions) {
    const { values } = props;
    const suggesting = useContext(Suggesting);
    const [shift, setShift] = React.useState(false);
    const [selected, setSelected] = React.useState<number>(-1);

    const [selectedEl, setSelectedEl] =
        React.useState<HTMLDivElement | null>(null);

    const Components = Elements.useElements();

    React.useEffect(() => {
        const callback = suggesting[1];
        if (callback) {
            callback(true);
            return () => {
                callback(false);
            };
        }
    });

    React.useEffect(() => {
        setSelected(props.selected ?? -1);
    }, [props.selected]);

    React.useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [shift, selected]);

    React.useEffect(() => {
        if (props.term && values.length > 0 && selectedEl) {
            selectedEl.scrollIntoView({ behavior: "smooth", block: "end" });
        } else if (selectedEl) {
            setSelectedEl(null);
        }
    }, [selectedEl]);

    function calmEvent(event: KeyboardEvent | React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleSelect(value: any) {
        return (event: React.MouseEvent) => {
            if (props.onSelect) {
                calmEvent(event);
                props.onSelect(value);
            }
        };
    }

    function handleKeyUp(event: KeyboardEvent) {
        calmEvent(event);
        if (event.key == "Shift") {
            setShift(false);
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key == "Shift") {
            setShift(true);
        } else if (event.key == "Enter") {
            calmEvent(event);
            if (selected < 0) {
                setSelected(0);
            } else if (selected > -1 && props.onSelect) {
                props.onSelect(props.values[selected]);
            }
        } else if (event.key == "Escape") {
            calmEvent(event);
            if (props.onClose) {
                props.onClose(event);
            }
        } else if (event.key == "ArrowUp" || (shift && event.key == "Tab")) {
            calmEvent(event);
            setSelected((val) => (val > 0 ? val - 1 : val));
        } else if (event.key == "ArrowDown" || event.key == "Tab") {
            calmEvent(event);
            setSelected((val) => (val >= values.length - 1 ? 0 : val + 1));
        }
    }

    return (
        <React.Fragment>
            {Boolean(props.term) &&
                values.map((value, index) => {
                    return (
                        <div
                            ref={selected == index ? setSelectedEl : undefined}
                            role="button"
                            key={String(index)}
                            onClick={handleSelect(value)}
                            className="flex flex-col"
                            data-suggestion-type={props.type}>
                            <Components.Suggestion
                                value={value}
                                type={props.type}
                                term={props.term}
                                suggestion={props.suggestion}
                                selected={selected == index}
                            />
                        </div>
                    );
                })}
        </React.Fragment>
    );
}

export function BasePortal({ subject, ...props }: IBasePortal) {
    const ref = useRef<HTMLDivElement | null>(null);
    const editor = useSlate();
    const [values, setValues] = useState<any>([]);

    const suggestions = useSuggestions(subject);

    useEffect(() => {
        const el = ref.current;
        if (el && subject.target && values.length > 0) {
            const domRange = ReactEditor.toDOMRange(editor, subject.target);
            const rect = domRange.getBoundingClientRect();
            if (
                rect.top + el.getBoundingClientRect().height + 24 >
                window.innerHeight
            ) {
                let left =
                    rect.left +
                    window.pageXOffset -
                    el.offsetWidth / 2 +
                    rect.width / 2;

                el.style.top = `${
                    rect.top + window.pageYOffset - el.offsetHeight - 8
                }px`;
                el.style.left = `${left < 0 ? 20 : left}px`;
            } else {
                el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                el.style.left = `${rect.left + window.pageXOffset}px`;
            }
        }
        suggestions.then(setValues);
    }, [values, suggestions, subject.target, ref.current]);

    return (
        <ReactPortal>
            <div
                ref={ref}
                className="absolute flex min-w-[150px] flex-col max-h-56 p-2 border border-gray-200 shadow-lg rounded-md z-[2000] bg-white overflow-y-auto">
                <Suggestions
                    onClose={props.onClose}
                    onSelect={props.onSelect}
                    selected={props.selected}
                    term={subject.term}
                    type={subject.type}
                    values={values}
                    suggestion={subject.suggestion}
                />
            </div>
        </ReactPortal>
    );
}

export const BasePopper = ReactPopper.create<HTMLDivElement, IBasePopper>(
    ({ subject, ...props }) => {
        const [values, setValues] = useState<any>([]);
        const suggestions = useSuggestions(subject);
        useEffect(() => {
            suggestions.then(setValues);
        }, [suggestions]);
        if (values.length > 0) {
            return (
                <ReactPopper
                    as={"div"}
                    placement="top-start"
                    portal={true}
                    distance={10}
                    tabIndex={-1}
                    anchorEl={props.anchorEl}
                    onClickAway={props.onClickAway}
                    data-suggestion={true}
                    style={{ width: props.anchorEl?.clientWidth }}
                    className="z-[2000] flex w-full flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 p-2 bg-white shadow-md  overflow-x-hidden overflow-y-auto">
                    <Suggestions
                        term={subject.term}
                        type={subject.type}
                        values={values}
                        onClose={props.onClose}
                        onSelect={props.onSelect}
                        suggestion={subject.suggestion}
                    />
                </ReactPopper>
            );
        }
        return null;
    }
);

export function Portal(props: IPortal) {
    const { open, subject, handleClose, handleSelect } = useControls(props);
    const suggesting = useSuggesting();

    if (subject.target && open) {
        return (
            <Suggesting.Provider value={props.suggesting ?? suggesting}>
                <BasePortal
                    subject={subject}
                    onClose={handleClose}
                    onSelect={handleSelect}
                />
            </Suggesting.Provider>
        );
    }
    return null;
}

export function Popper(props: IPopper) {
    const { open, subject, handleClose, handleSelect } = useControls(props);
    const suggesting = useSuggesting();
    return (
        <Suggesting.Provider value={props.suggesting ?? suggesting}>
            <BasePopper
                open={open && Boolean(subject.term)}
                subject={subject}
                onClose={handleClose}
                onSelect={handleSelect}
                anchorEl={props.anchorEl}
            />
        </Suggesting.Provider>
    );
}

type TSuggest = typeof Portal & {
    Popper: typeof Popper;
    Context: typeof Context;
};

Portal.Popper = Popper;
Portal.Context = Context;

export default Portal as TSuggest;
