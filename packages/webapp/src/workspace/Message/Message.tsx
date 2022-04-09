import React, { useState, useRef } from "react";
import clx from "classnames";
import moment from "moment";
import { useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import FlagIcon from "@material-ui/icons/Flag";
import PinIcon from "@material-ui/icons/FiberPin";
import Menu from "./Menu";
import Edit from "./Edit";
import ReplyButton from "./ReplyButton";
import Reaction from "./Reaction";
import emoji from "@octal/emoji";
import { useTool } from "../Space/hooks";
import { Markdown, Text } from "@octal/ui";

import UserCard from "../UserCard";
import { useUser, useAuthId } from "@octal/store";
import { MessageRecord } from "@octal/store/lib/records";
import {
    flagMesssag,
    unflagMesssag,
    pinMesssag,
    unpinMesssag,
    reactMessage,
    deleteMessage,
    unreactMessage,
} from "@octal/store/lib/actions/thread";

export interface IMessage {
    extra?: boolean;
    tsformat?: string;
    selected?: boolean;
    previews?: boolean;
    message: MessageRecord;
}

export default React.memo<IMessage>(({ message, ...props }) => {
    const tool = useTool();

    const authId = useAuthId();

    const dispatch = useDispatch();

    const anchor = useRef<HTMLDivElement>(null);

    const author = useUser(message.user_id)!;

    const [popover, setPopover] = useState<JSX.Element | null>(null);

    const [hovering, setHovering] = useState<boolean>(false);

    function handleReaction(reaction: any) {
        const params = {
            space_id: message.space_id,
            message_id: message.id,
            thread_id: message.thread_id,
            reaction: reaction.native,
        };
        const rtx = message.reactions.find(
            (rtx) => rtx.reaction == reaction.native
        );
        if (rtx && rtx.users.includes(authId)) {
            dispatch(unreactMessage(params));
        } else {
            dispatch(reactMessage(params));
        }
    }

    function handleFlag() {
        const params = {
            message_id: message.id,
            thread_id: message.thread_id,
            space_id: message.space_id,
        };
        const action = message.flagged
            ? unflagMesssag(params)
            : flagMesssag(params);
        return dispatch(action);
    }

    function handlePin() {
        const params = {
            thread_id: message.thread_id,
            message_id: message.id,
            space_id: message.space_id,
        };
        const action = message.pinned
            ? unpinMesssag(params)
            : pinMesssag(params);
        return dispatch(action);
    }

    function handleDelete() {
        const params = {
            message_id: message.id,
            space_id: message.space_id,
            thread_id: message.thread_id,
        };
        dispatch(deleteMessage(params));
    }

    function handleReply() {
        tool.open("reply", { id: message.id });
    }

    function handleEdit() {
        const node = <Edit message={message} onClose={closePopover} />;
        setPopover(node);
    }

    function closePopover() {
        setPopover(null);
        handleNotHovering();
    }

    function handleHovering() {
        if (!hovering) setHovering(true);
    }

    function makeReactionClickHandler(reaction: any) {
        return () => {
            let data = emoji.query(reaction.reaction);
            handleReaction(data);
        };
    }

    function handleNotHovering() {
        if (hovering) setHovering(false);
    }

    function handleOpenUserCard({ target }: any) {
        setPopover(
            <UserCard id={author.id} anchor={target} onClose={closePopover} />
        );
    }

    function handleHighlightClicked(e: React.MouseEvent, node: any) {
        if (node.type === "user" || node.type === "bot") {
            setPopover(
                <UserCard
                    id={node.type_id}
                    anchor={e.currentTarget}
                    onClose={closePopover}
                />
            );
        } else if (node.type === "space") {
            dispatch({
                type: "OPEN_CHANNEL",
                payload: node.type_id,
            });
        }
    }

    return (
        <div
            id={`message:${message.id}`}
            onMouseOver={handleHovering}
            onMouseLeave={handleNotHovering}
            className={clx(
                "flex flex-row px-4 relative group hover:bg-gray-100",
                props.extra && "pt-1",
                props.selected && "bg-primary-50"
            )}>
            <div className="flex flex-none justify-center flex-row w-16">
                {props.extra ? (
                    <Avatar
                        alt={author.name}
                        src={author.avatar}
                        onClick={handleOpenUserCard}>
                        {author.name}
                    </Avatar>
                ) : (
                    <span className="group-hover:visible select-none invisible text-xs pt-1 font-semibold text-gray-500">
                        {moment(message.timestamp).format("LT")}
                    </span>
                )}
            </div>

            <div className="flex flex-grow flex-col">
                {props.extra && (
                    <div className="flex flex-row items-center">
                        <button
                            onClick={handleOpenUserCard}
                            className="text-base font-bold">
                            {author.username}
                        </button>
                        <span className="px-2 font-bold text-gray-500">·</span>
                        <span className="text-xs select-none pt-1 font-semibold text-gray-500">
                            {moment(message.timestamp).format(props.tsformat)}
                        </span>
                    </div>
                )}

                <div className="flex flex-col" ref={anchor}>
                    <div className="flex flex-row">
                        {message.flagged && <FlagIcon />}
                        {message.pinned && <PinIcon />}
                    </div>
                    {emoji.test(message.content) ? (
                        <div className="text-6xl">
                            <Text>{message.content}</Text>
                        </div>
                    ) : (
                        <div className="text-msg">
                            <Markdown>{message.parsed}</Markdown>
                        </div>
                    )}
                </div>

                {/**
                {props.message.resource && (
                    <File
                        preview={props.preview}
                        resource={props.message.resource}
                    />
                )}
                **/}

                <div className="flex flex-row flex-wrap ">
                    {message.reactions.map((reaction) => (
                        <Reaction
                            key={reaction.reaction}
                            name={reaction.reaction}
                            count={reaction.users.size}
                            highlight={reaction.users.includes(authId)}
                            onClick={makeReactionClickHandler(reaction)}
                        />
                    ))}
                </div>

                {message.last_reply && <ReplyButton message={message} />}
            </div>

            <Menu
                open={hovering}
                anchor={anchor.current!}
                onPin={message.pinned ? undefined : handlePin}
                onUnpin={message.pinned ? handlePin : undefined}
                onFlag={message.flagged ? undefined : handleFlag}
                onUnflag={message.flagged ? handleFlag : undefined}
                onEdit={authId == message.user_id ? handleEdit : undefined}
                onReact={handleReaction}
                onReply={message.reply_thread_id ? handleReply : undefined}
                onDelete={handleDelete}
                onClose={() => setHovering(false)}
            />
            {popover && popover}
        </div>
    );
});
