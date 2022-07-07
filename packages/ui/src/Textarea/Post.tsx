import React, { useState, useMemo, useCallback, useEffect } from "react";
import clx from "classnames";
import Elements from "../Elements";
import Popover from "@material-ui/core/Popover";
import * as Icons from "@octal/icons";
import emoji from "@octal/emoji";
import UIEvent from "../event";
import {
    useInput,
    useChangeHandler,
    useReflection,
    useKeyDownHandler,
} from "./hooks";
import { EventTarget, InputProps } from "./types";
import Suggestions, { useSuggesting } from "./Suggestion";
import Button, { Base as ButtonBase } from "../Button";
import UploadQueue from "./UploadQueue";
import { Slater } from "@octal/markdown";
import Emoji from "../Emoji";
import {
    wrap,
    withPaste,
    withMention,
    withTables,
    withLink,
    withShortcuts,
} from "./wrappers";
import Tooltip from "../Tooltip";

// Import the Slate editor factory.
import { Transforms, Editor, createEditor } from "slate";

import {
    fileinfo,
    insertEmoji,
    isBlockActive,
    insertMention,
    isMarkActive,
    toggleMark,
    toggleBlock,
} from "./utils";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const slater = Slater.create();

const wrappers = [
    withReact,
    withPaste(slater),
    withLink,
    withMention,
    withTables,
    withShortcuts,
];

interface IActionButton {
    boolean?: boolean;
    disabled?: boolean;
    component?: string;
    htmlFor?: string;
    tooltip?: string;
    icon: typeof Icons.Editor.Multiline;
    highlight?: boolean;
    onClick?: (e: React.MouseEvent) => any;
}

const FORMAT_ACTIONS = [
    {
        type: "mark",
        format: "bold",
    },
    {
        type: "mark",
        format: "italic",
    },
    {
        type: "mark",
        format: "code",
    },
    {
        type: "block",
        format: "heading",
    },
    {
        type: "block",
        format: "blockquote",
    },
    {
        type: "block",
        format: "list",
    },
];

let gcid = 0;

const transformOrigin = {
    vertical: "top",
    horizontal: "right",
};

const anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
};

const ActionButton = React.memo<IActionButton>((props) => {
    const Icon = props.icon;

    const className =
        "h-5 w-5 flex justify-center items-center rounded text-gray-500 mx-2";

    const icon =
        props.component === "label" ? (
            <label
                onClick={props.onClick as any}
                htmlFor={props.htmlFor as any}
                className={clx(className, props.highlight && "bg-gray-200")}>
                <Icon />
            </label>
        ) : (
            <ButtonBase
                onClick={props.onClick as any}
                disabled={props.disabled as any}
                className={clx(className, props.highlight && "bg-gray-200")}>
                <Icon />
            </ButtonBase>
        );
    if (props.disabled) {
        return icon;
    }

    return (
        <Tooltip
            title={
                <span className="font-semibold text-sm text-white">
                    {props.tooltip}
                </span>
            }
            placement="top">
            {icon}
        </Tooltip>
    );
});

export default React.memo<InputProps>((props) => {
    const Component = Elements.useElements();

    const suggesting = useSuggesting();

    const [popup, setPopup] = useState<string | null>(null);

    const [queue, setQueue] = useState<boolean>(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);

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

    const [state, setState] = input;

    useReflection(editor, input, props, slater);

    const handleChange = useChangeHandler(editor, input, props, slater);

    const [fid] = useState(`${gcid}`);

    const [accept, setAccept] = useState<string>("");

    const [Dialog, setDialog] = useState<any>(null);

    const [anchor, setAnchor] = useState<HTMLElement>();

    const file = state.files.length > 0 ? state.files[0] : undefined;

    // Increament the global counter
    // id to prevent input elemnt
    // id collision
    useEffect(() => {
        gcid = gcid + 1;
    });

    useEffect(() => {
        if (props.accept?.types) {
            setAccept(() => {
                return props
                    .accept!.types.split(",")
                    .map((ext) => `.${ext.trim()}`)
                    .join(",");
            });
        }
    }, [props.accept?.types]);

    const handleCloseDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const handleOpenEmojiPopup = useCallback((e: any) => {
        setAnchor(e.target);
        setPopup("emoji");
    }, []);

    const keyDownHandler = useKeyDownHandler(
        editor,
        state,
        suggesting[0] === false,
        props
    );

    function insertAtCursor(value: any) {
        const node = {
            src: emoji.image(value),
            type: "emoji",
            emoji: value,
            children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, [node, { text: "" }] as any);
    }

    function handleCloseMenu() {
        setPopup(null);
    }

    function handleEmojiInput(emoji: any) {
        insertAtCursor(emoji.native);
        handleCloseMenu();
    }

    function handleFileInput(ev: any) {
        let files: File[] = [];
        for (let file of ev.target.files) {
            files.push(file);
        }
        if (props.files == undefined)
            setState((state) => ({ ...state, files }));
        setPopup(null);
        if (props.onChange) {
            const text = state.value;
            const event = UIEvent.synthesis(ev);
            const target = {
                files: files,
                value: text,
                editor,
                data: state.data,
            };
            const uievent = UIEvent.create<EventTarget>(
                target,
                event,
                "change"
            );
            props.onChange(uievent);
        }
    }

    function handleMentionSelected(selected: any) {
        if (selected.type == "mention") {
            Transforms.select(editor, selected.target);
            insertMention(editor, selected.value.value);
        } else if (selected.type == "emoji") {
            Transforms.select(editor, selected.target);
            insertEmoji(editor, selected.value.native);
        }
    }

    function handleCloseUploadQueue() {
        setQueue(false);
    }

    function handleTogggleUploadQueue() {
        setQueue((queue) => !queue);
    }

    function handleUpdateFiles(e: UIEvent<{ value: File[] }>) {
        const files = e.target.value;
        if (props.files == undefined)
            setState((state) => ({ ...state, files }));
        if (props.onChange) {
            const text = state.value;
            const target = { files, value: text, editor, data: state.data };
            const uievent = UIEvent.create<EventTarget>(
                target,
                e.event,
                "change"
            );
            props.onChange(uievent);
        }
    }

    function renderFile(file: File) {
        const info = fileinfo(file);
        return (
            <Tooltip
                title={<span className="font-bold text-xs">{info.name}</span>}>
                <button
                    className="cursor-pointer text-primary-500 flex justify-center items-center w-10 h-10 rounded-md"
                    onClick={handleTogggleUploadQueue}>
                    <Icons.File
                        type={info.type}
                        ext={info.ext}
                        className="h-8 w-8"
                    />
                </button>
            </Tooltip>
        );
    }

    function renderUploadUI() {
        if (Boolean(file)) {
            return renderFile(file!);
        }
        if (props.accept) {
            return (
                <React.Fragment>
                    <label
                        htmlFor={fid}
                        className="cursor-pointer flex justify-center items-center w-10 h-10 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-md">
                        <Icons.Editor.Attach className="h-5 w-5" />
                    </label>
                    <input
                        id={fid}
                        type="file"
                        accept={accept}
                        multiple={true}
                        onChange={handleFileInput}
                        className="w-0 h-0 invisible"
                    />
                </React.Fragment>
            );
        }
        return <React.Fragment />;
    }

    return (
        <Slate editor={editor} value={state.data} onChange={handleChange}>
            <div
                ref={rootRef}
                className="flex flex-col rounded-md ring-2 text-base ring-gray-300 overflow-hidden">
                {Dialog && <Dialog onClose={handleCloseDialog} />}
                <div className="flex flex-row p-1.5 overflow-hidden">
                    {renderUploadUI()}
                    <Editable
                        autoFocus={true}
                        className="p-2 flex-1 break-all"
                        placeholder="Post message"
                        onKeyDown={keyDownHandler}
                        disabled={props.disabled}
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}
                    />
                </div>

                <Suggestions.Popper
                    suggesting={suggesting}
                    onSelect={handleMentionSelected}
                    anchorEl={rootRef.current}
                />
                <div className="flex flex-row justify-between bg-gray-100 border-t-2 border-gray-200 p-1">
                    <div className="flex flex-row items-center space-x-1">
                        {FORMAT_ACTIONS.map((format, index) => {
                            if (format.type == "mark") {
                                return (
                                    <Button
                                        color="clear"
                                        variant="icon"
                                        key={String(index)}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            toggleMark(editor, format.format);
                                        }}>
                                        <MarkIcon
                                            editor={editor}
                                            format={format.format}
                                        />
                                    </Button>
                                );
                            } else if (format.type == "block") {
                                return (
                                    <Button
                                        color="clear"
                                        variant="icon"
                                        key={String(index)}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            toggleBlock(editor, format.format);
                                        }}>
                                        <BlockIcon
                                            editor={editor}
                                            format={format.format}
                                        />
                                    </Button>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div className="flex flex-row items-center justify-end">
                        <ActionButton
                            tooltip="Emoji"
                            icon={Icons.Emoji}
                            onClick={handleOpenEmojiPopup}
                            disabled={props.disabled}
                        />
                    </div>
                    {popup === "attachment" && (
                        <Popover
                            open={true}
                            onClose={handleCloseMenu}
                            anchorEl={anchor}
                            className={"flex flex-row"}
                            anchorOrigin={anchorOrigin as any}
                            transformOrigin={transformOrigin as any}></Popover>
                    )}
                    {popup === "emoji" && (
                        <Popover
                            open={true}
                            onClose={handleCloseMenu}
                            anchorEl={anchor}
                            anchorOrigin={anchorOrigin as any}
                            transformOrigin={transformOrigin as any}>
                            <Emoji.Picker
                                set="facebook"
                                onClick={handleEmojiInput}
                            />
                        </Popover>
                    )}
                </div>
            </div>
            <UploadQueue
                open={queue}
                files={state.files}
                onClose={handleCloseUploadQueue}
                onChange={handleUpdateFiles}
            />
        </Slate>
    );
});

function MarkIcon({ editor, format }: { editor: Editor; format: string }) {
    const active = isMarkActive(editor, format);
    const className = active
        ? "text-xs text-gray-800"
        : "text-xs text-gray-500";
    switch (format) {
        case "bold":
            return <Icons.Editor.Bold className={className} />;
        case "italic":
            return <Icons.Editor.Italic className={className} />;
        case "code":
            return <Icons.Editor.Code className={className} />;
        default:
            return <></>;
    }
}

function BlockIcon({ editor, format }: { editor: Editor; format: string }) {
    const active = isBlockActive(editor, format);
    const className = active
        ? "text-xs text-gray-800"
        : "text-xs text-gray-500";
    switch (format) {
        case "list":
            return <Icons.Editor.UnorderedList className={className} />;

        case "heading":
            return <Icons.Editor.Heading className={className} />;

        case "blockquote":
            return <Icons.Editor.Quote className={className} />;

        default:
            return <></>;
    }
}
