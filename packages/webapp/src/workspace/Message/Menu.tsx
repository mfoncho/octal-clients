import React, { useState, useContext } from "react";
import Popover from "@material-ui/core/Popover";
import JumpIcon from "@material-ui/icons/KeyboardReturn";
import { Picker as EmojiPicker, EmojiData } from "emoji-mart";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tooltip } from "@octal/ui";
import * as Icons from "@octal/icons";
import Editor from "./Editor";

export type ActionT =
    | "react"
    | "flag"
    | "pin"
    | "reply"
    | "edit"
    | "delete"
    | "manage"
    | "jump";

interface IButtonIcon {
    className?: string;
    fontSize: "inherit" | "default" | "small" | "large";
}

interface IButton {
    name: string;
    icon:
        | React.ComponentClass<IButtonIcon>
        | React.FunctionComponent<IButtonIcon>;
    classes?: string;
    onClick: any;
}

interface IEmojiPopover {
    anchor: Element;
    onClose: (e: any, reason: string) => void;
    onSelect: (emoji: EmojiData, event: React.MouseEvent) => void;
}

export interface IMenu {
    id: string;
    open?: boolean;
    pinned: boolean;
    buttons: ActionT[];
    flagged: boolean;
    anchor: HTMLElement;
    onPin?: () => void;
    onEdit?: () => void;
    onFlag?: () => void;
    onReply?: () => void;
    onReact?: (reaction: string) => void;
    onDelete?: () => void;
}

enum PopupType {
    CLOSE,
    EMOJI,
    EDITOR,
}

export const Context = React.createContext<string[]>([]);

export const Reply = React.createContext<
    (id: string, e: React.MouseEvent) => void
>(() => {});

function EmojiPopover(props: IEmojiPopover) {
    return (
        <Popover
            open
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            anchorEl={props.anchor}
            onClose={props.onClose}>
            <EmojiPicker
                set="facebook"
                title="Ma Mbi"
                onClick={props.onSelect}
            />
        </Popover>
    );
}

const present = 2;

const Menu = React.memo<IMenu>(({ open, ...props }) => {
    const actions = useContext(Context);

    const onReply = useContext(Reply);

    const [popup, setPopup] = useState<PopupType>(PopupType.CLOSE);

    const [expanded, setExpanded] = useState<boolean>(false);

    function handleClosePopover() {
        setPopup(PopupType.CLOSE);
    }

    function handleReact() {
        setPopup(PopupType.EMOJI);
    }

    function handleReaction(reaction: any) {
        if (props.onReact) {
            props.onReact(reaction.native);
        }
    }

    function handleJump() {}

    function handleEdit() {
        setPopup(PopupType.EDITOR);
    }

    function renderButton(btn: IButton, index: number) {
        const Icon: any = btn.icon;
        return (
            <Tooltip
                key={String(index)}
                title={
                    <span className="text-white text-xs font-semibold">
                        {btn.name}
                    </span>
                }
                placement="top">
                <button
                    onClick={btn.onClick}
                    className="flex items-center p-1 rounded-md my-0.5 text-gray-600 justify-center hover:bg-slate-200">
                    <Icon className="w-4 h-4" />
                </button>
            </Tooltip>
        );
    }

    const buttons: Array<IButton> = props.buttons
        .filter((action: ActionT) => {
            const active = actions.includes(action);
            if (action === "delete" && active === false)
                return action.includes("destroy");
            return active;
        })
        .map((button: ActionT): IButton => {
            switch (button) {
                case "react":
                    return {
                        name: "React",
                        icon: Icons.Emoji,
                        onClick: handleReact,
                    };

                case "flag":
                    return {
                        name: props.flagged ? "Unflag Message" : "Flag Message",
                        icon: Icons.Bookmark,
                        onClick: props.onFlag,
                    };

                case "pin":
                    return {
                        name: props.pinned ? "Unpin Message" : "Pin Message",
                        icon: Icons.Pin,
                        onClick: props.onPin,
                    };

                case "reply":
                    return {
                        name: "Reply",
                        icon: Icons.Reply,
                        onClick: (e: any) => onReply(props.id, e),
                    };

                case "edit":
                    return {
                        name: "Edit Message",
                        icon: Icons.Edit,
                        onClick: handleEdit,
                    };

                case "jump":
                    return {
                        name: "Goto Message",
                        icon: JumpIcon,
                        onClick: handleJump,
                    };

                case "delete":
                    return {
                        name: "Delete Message",
                        icon: Icons.Delete,
                        onClick: props.onDelete,
                    };
                default:
                    return {
                        name: "unknown",
                        icon: ((props: any) => ({})) as any,
                        onClick: () => {},
                    };
            }
        });

    const collapsable = buttons.length > present;

    return (
        <div className="absolute invisible group-hover:visible hover:shadow-md bg-white rounded-md -top-8 right-4 flex flex-row items-center border border-gray-100 first-child:rounded-l-md last-child:rounded-r-md bg-slate-100 space-x-1 pl-2">
            {buttons
                .slice(0, expanded ? buttons.length : present)
                .map(renderButton)}

            {collapsable && (
                <button
                    aria-label="Show more"
                    className="p-1 text-gray-600 flex items-center justify-center hover:bg-slate-200 rounded-md my-0.5 "
                    onClick={() => setExpanded(!expanded)}>
                    <ExpandMoreIcon
                        fontSize="small"
                        className={
                            expanded
                                ? "w-5 h-5 rotate-90"
                                : "w-5 h-5 -rotate-90"
                        }
                    />
                </button>
            )}
            {popup === PopupType.EMOJI && (
                <EmojiPopover
                    anchor={props.anchor}
                    onClose={handleClosePopover}
                    onSelect={handleReaction}
                />
            )}
            {popup === PopupType.EDITOR && (
                <Editor id={props.id} onClose={handleClosePopover} />
            )}
        </div>
    );
});

type FCMenu = typeof Menu & { Context: typeof Context; Reply: typeof Reply };

(Menu as FCMenu).Context = Context;
(Menu as FCMenu).Reply = Reply;

export default Menu as FCMenu;
