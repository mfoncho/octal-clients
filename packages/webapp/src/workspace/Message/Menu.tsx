import React, { useState, useContext } from "react";
import Popover from "@material-ui/core/Popover";
import FlagIcon from "@material-ui/icons/Flag";
import EditIcon from "@material-ui/icons/Edit";
import ReplyIcon from "@material-ui/icons/Reply";
import PinIcon from "@material-ui/icons/FiberPin";
import ReactionIcon from "@material-ui/icons/Mood";
import DeleteIcon from "@material-ui/icons/Delete";
import JumpIcon from "@material-ui/icons/KeyboardReturn";
import { Picker as EmojiPicker, EmojiData } from "emoji-mart";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tooltip } from "@octal/ui";
import { usePermissions } from "../Space/hooks";

export type ActionT =
    | "react"
    | "flag"
    | "pin"
    | "reply"
    | "edit"
    | "delete"
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
    onClick: (e: React.MouseEvent) => void;
}

export const Context = React.createContext({
    actions: [] as ActionT[],
});

interface IEmojiPopover {
    anchor: Element;
    onClose: (e: any, reason: string) => void;
    onSelect: (emoji: EmojiData, event: React.MouseEvent) => void;
}

interface IMenu {
    open?: boolean;
    anchor: HTMLElement;
    onPin?: () => void;
    onFlag?: () => void;
    onEdit?: () => void;
    onUnpin?: () => void;
    onReact?: (emoji: EmojiData, event: React.MouseEvent) => void;
    onReply?: () => void;
    onClose?: () => void;
    onUnflag?: () => void;
    onDelete?: () => void;
}

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

export default React.memo<IMenu>(({ open, ...props }: any) => {
    const { actions } = useContext(Context);

    const permissions = usePermissions();

    const [popup, setPopup] = useState<JSX.Element | null>(null);

    const [expanded, setExpanded] = useState<boolean>(false);

    function handleClosePopup() {
        setPopup(null);
        props.onClose();
    }

    function handleReact() {
        const node = (
            <EmojiPopover
                anchor={props.anchor}
                onClose={handleClosePopup}
                onSelect={handleReaction}
            />
        );
        setPopup(node);
    }

    function handleReaction(reaction: any, e: any) {
        props.onReact(reaction, e);
        setPopup(null);
    }

    function handleJump() {}

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
                    className="flex items-center p-2 text-gray-600 justify-center hover:bg-gray-200">
                    <Icon fontSize="small" className="w-5 h-5" />
                </button>
            </Tooltip>
        );
    }

    const buttons: Array<IButton> = actions
        .filter((action: ActionT) => {
            switch (action) {
                case "edit":
                    return permissions.edit_message.value && props.onEdit;

                case "reply":
                    return permissions.post_reply.value && props.onReply;

                case "flag":
                    return props.onFlag || props.onUnflag;

                case "pin":
                    return (
                        permissions.pin_message.value &&
                        (props.onPin || props.onUnpin)
                    );

                case "delete":
                    return (
                        permissions.manage_messages.value ||
                        (permissions.delete_message.value && props.onEdit)
                    );

                default:
                    return true;
            }
        })
        .map((button: ActionT): IButton => {
            switch (button) {
                case "react":
                    return {
                        name: "React",
                        icon: ReactionIcon,
                        onClick: handleReact,
                    };

                case "flag":
                    return {
                        name: props.onUnflag
                            ? "Unflag Message"
                            : "Flag Message",
                        icon: FlagIcon,
                        onClick: props.onUnflag || props.onFlag,
                    };

                case "pin":
                    return {
                        name: props.onUnpin ? "Unpin Message" : "Pin Message",
                        icon: PinIcon,
                        onClick: props.onUnpin || props.onPin,
                    };

                case "reply":
                    return {
                        name: "Reply",
                        icon: ReplyIcon,
                        onClick: props.onReply,
                    };

                case "edit":
                    return {
                        name: "Edit Message",
                        icon: EditIcon,
                        onClick: props.onEdit,
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
                        icon: DeleteIcon,
                        onClick: props.onDelete,
                    };
                default:
                    return {
                        name: "unknown",
                        icon: DeleteIcon,
                        onClick: () => {},
                    };
            }
        });

    const collapsable = buttons.length > present;

    return (
        <div className="absolute invisible group-hover:visible hover:shadow-md bg-white rounded-md -top-8 right-4 flex flex-row items-center border border-gray-400 first-child:rounded-l-md last-child:rounded-r-md">
            {buttons
                .slice(0, expanded ? buttons.length : present)
                .map(renderButton)}

            {collapsable && (
                <button
                    aria-label="Show more"
                    className="p-2 text-gray-600 flex items-center justify-center hover:bg-gray-200"
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
            {popup}
        </div>
    );
});
