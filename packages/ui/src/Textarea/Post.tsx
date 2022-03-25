import React, { useState, useMemo, useCallback, useEffect } from "react";
import clx from "classnames";
import Elements from "../Elements";
import Popover from "@material-ui/core/Popover";
import * as Icons from "@octal/icons";
import emoji from "@octal/emoji";
import Mention from "./Mention";
import Button, { Base as ButtonBase } from "../Button";
import UploadQueue from "./UploadQueue";
import { Slater } from "@octal/markdown";
import Emoji from "../Emoji";
import { IFileItem } from "./types";
import {
    wrap,
    withPaste,
    withMention,
    withTables,
    withShortcuts,
} from "./wrappers";
import Tooltip from "../Tooltip";

import isHotkey from "is-hotkey";

// Import the Slate editor factory.
import { Transforms, Editor, createEditor, Descendant } from "slate";

import {
    fileItem,
    isBlockActive,
    insertMention,
    isMarkActive,
    toggleMark,
    clearEditor,
    toggleBlock,
    isEmojiActive,
} from "./utils";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const slater = Slater.create();

const wrappers = [
    withReact,
    withPaste(slater),
    withMention,
    withTables,
    withShortcuts,
];

export interface IPostInputState {
    text: string;
    file?: File;
}

export interface IMessagePost {
    text: string;
    file?: File;
}

export interface IUpload {
    max: number;
    accept: string;
}

export interface IPostInput {
    onChange?: (state: IPostInputState) => void;
    onSubmit?: (state: IMessagePost) => void;
    value?: string;
    // SOR is acronym for
    // Submit On Return
    rows?: number;
    multiline?: boolean;
    upload?: IUpload;
    autoFocus?: boolean;
    placeholder?: string;
    disabled?: boolean;
    passthrough?: boolean;
}

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

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+`": "code",
    "shift+enter": "new_line",
};

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
        format: "heading-five",
    },
    {
        type: "block",
        format: "heading-six",
    },
    {
        type: "block",
        format: "blockquote",
    },
    {
        type: "block",
        format: "numbered-list",
    },
    {
        type: "block",
        format: "bulleted-list",
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

const initialValue: any = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    },
];

export default React.memo<IPostInput>((props: IPostInput) => {
    const Component = Elements.useElements();

    const [popup, setPopup] = useState<string | null>(null);

    const [queue, setQueue] = useState<boolean>(false);

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

    const [fid] = useState(`${gcid}`);

    const [files, setFiles] = useState<IFileItem[]>([]);

    const [accept, setAccept] = useState<string>("");

    const [Dialog, setDialog] = useState<any>(null);

    const [anchor, setAnchor] = useState<HTMLElement>();

    const file = files.length > 0 ? files[0] : undefined;

    // Increament the global counter
    // id to prevent input elemnt
    // id collision
    useEffect(() => {
        gcid = gcid + 1;
    });

    useEffect(() => {
        const { value } = props;
        if (Boolean(value)) {
            setValue(slater.parse(value!));
        }
    }, []);

    useEffect(() => {
        if (props.upload?.accept) {
            setAccept(() => {
                return props
                    .upload!.accept.split(",")
                    .map((ext) => `.${ext.trim()}`)
                    .join(",");
            });
        }
    }, [props.upload?.accept]);

    useEffect(() => {
        if (files.length == 0) {
            setQueue(false);
        }
    }, [files.length]);

    const handleCloseDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const handleOpenEmojiPopup = useCallback((e: any) => {
        setAnchor(e.target);
        setPopup("emoji");
    }, []);

    function handleSubmit() {
        const text = slater.serialize(value).trim();
        if (text.length > 0 && props.onSubmit) {
            if (file) {
                props.onSubmit({ text, file: file.file });
                setFiles((files) => files.slice(1));
            } else {
                props.onSubmit({ text });
            }
            clearEditor(editor);
        }
    }

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

    function handleFileInput(event: any) {
        let files = [];
        for (let file of event.target.files) {
            files.push(file);
        }
        setFiles(files.map(fileItem));
        setPopup(null);
    }

    function handleChange(value: any) {
        setValue(value);
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
            return handleSubmit();
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

    function handleMentionSelected({ target, mention }: any) {
        Transforms.select(editor, target as any);
        insertMention(editor, mention.value);
    }

    function handleCloseUploadQueue() {
        setQueue(false);
    }

    function handleTogggleUploadQueue() {
        setQueue((queue) => !queue);
    }

    function handleRemoveFile(index: number) {
        setFiles((files) => {
            let qfiles = [...files];
            qfiles.splice(index, 1);
            return qfiles;
        });
    }

    return (
        <Slate editor={editor} value={value} onChange={handleChange}>
            <div
                ref={rootRef}
                className="flex flex-col rounded-md ring-2 text-base ring-gray-300 overflow-hidden">
                {Dialog && <Dialog onClose={handleCloseDialog} />}
                <div className="flex flex-row p-1.5 overflow-hidden">
                    {Boolean(file) ? (
                        <Tooltip
                            title={
                                <span className="font-bold text-xs">
                                    {file!.file.name}
                                </span>
                            }>
                            <button
                                className="cursor-pointer text-primary-500 flex justify-center items-center w-10 h-10 rounded-md"
                                onClick={handleTogggleUploadQueue}>
                                <Icons.File
                                    type={file!.type}
                                    ext={file!.ext}
                                    className="h-8 w-8"
                                />
                            </button>
                        </Tooltip>
                    ) : (
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
                    )}

                    <Editable
                        autoFocus={true}
                        className="p-2 flex-1 break-all"
                        placeholder="Post message"
                        onKeyDown={handleKeyDown}
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}
                    />
                </div>

                <Mention.Popper
                    onSelect={handleMentionSelected}
                    anchorEl={rootRef.current}
                />
                <div className="flex flex-row justify-between bg-gray-100 border-t-2 border-gray-200 p-1">
                    <div className="flex flex-row items-center">
                        {FORMAT_ACTIONS.map((format, index) => {
                            if (format.type == "mark") {
                                return (
                                    <Button
                                        color="clear"
                                        variant="icon"
                                        className="mr-1"
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
                                        className="mr-1"
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
                files={files}
                onClose={handleCloseUploadQueue}
                onDequeue={handleRemoveFile}
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
        case "numbered-list":
            return <Icons.Editor.OrderedList className={className} />;

        case "bulleted-list":
            return <Icons.Editor.UnorderedList className={className} />;

        case "heading-five":
            return <Icons.Editor.Heading className={className} />;

        case "heading-six":
            return <Icons.Editor.Heading className={className} />;

        case "blockquote":
            return <Icons.Editor.Quote className={className} />;

        default:
            return <></>;
    }
}
