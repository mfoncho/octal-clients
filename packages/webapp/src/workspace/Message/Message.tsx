import React, { useState, useRef } from "react";
import clx from "classnames";
import moment from "moment";
import * as Icons from "@colab/icons";
import Reply from "./Reply";
import Menu, { ActionT } from "./Menu";
import ReplyButton from "./ReplyButton";
import Reaction from "./Reaction";
import emoji from "@colab/emoji";
import { Markdown, Text } from "@colab/ui";
import UserCard from "@workspace/UserCard";
import { useUser } from "@colab/store";
import { useActions } from "./hooks";
import Attachment from "./Attachment";
import { MessageRecord } from "@colab/store/lib/records";

export interface IMessage {
    authid: string;
    extra?: boolean;
    menu?: boolean;
    tsformat?: string;
    selected?: boolean;
    previews?: boolean;
    message: MessageRecord;
}

const authorMenuActions: ActionT[] = [
    "react",
    "bookmark",
    "reply",
    "pin",
    "edit",
    "delete",
];
const userMenuActions: ActionT[] = [
    "react",
    "reply",
    "bookmark",
    "pin",
    "delete",
];

export default React.memo<IMessage>(({ message, ...props }) => {
    const anchor = useRef<HTMLDivElement>(null);

    const actions = useActions(message, props.authid);

    const author = useUser(message.user_id)!;

    const [card, handleOpenCard] = UserCard.useCard(author?.id);

    const [hovering, setHovering] = useState<boolean>(false);

    function handleHovering() {
        if (!hovering) setHovering(true);
    }

    function makeReactionClickHandler(reaction: any) {
        return () => {
            actions.onReact(reaction.reaction);
        };
    }

    function handleNotHovering() {
        if (hovering) setHovering(false);
    }

    return (
        <div
            onMouseOver={handleHovering}
            onMouseLeave={handleNotHovering}
            className={clx(
                "flex flex-col px-4 relative group hover:bg-gray-100",
                props.extra && "pt-1",
                props.selected && "bg-primary-50"
            )}>
            {message.reply_id && <Reply id={message.reply_id} />}
            <div className="flex flex-row">
                <div className="flex flex-none justify-center flex-row w-16">
                    {props.extra ? (
                        <img
                            role="button"
                            alt={author.name}
                            src={author.avatar_url}
                            className="rounded-full w-[40px] h-[40px] my-1"
                            onClick={handleOpenCard}
                        />
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
                                onClick={handleOpenCard}
                                className="text-base font-bold">
                                {author.username}
                            </button>
                            <span className="px-2 font-bold text-gray-500">
                                ·
                            </span>
                            <span className="text-xs select-none pt-1 font-semibold text-gray-500">
                                {moment(message.timestamp).format(
                                    props.tsformat
                                )}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col" ref={anchor}>
                        <div className="flex flex-row text-gray-600 space-x-2">
                            {message.pinned && (
                                <Icons.Pin className="h-2.5 w-2.5" />
                            )}
                            {Boolean(actions.bookmark) && (
                                <Icons.Bookmark className="h-2.5 w-2.5" />
                            )}
                        </div>
                        {emoji.test(message.content) ? (
                            <div className="text-6xl">
                                <Text>{message.content}</Text>
                            </div>
                        ) : (
                            message.content.length > 0 && (
                                <div className="text-msg">
                                    <Markdown>{message.parsed}</Markdown>
                                </div>
                            )
                        )}
                    </div>

                    {message.attachment && (
                        <Attachment file={message.attachment} />
                    )}

                    <div className="flex flex-row flex-wrap ">
                        {message.reactions.map((reaction) => (
                            <Reaction
                                key={reaction.reaction}
                                name={reaction.reaction}
                                count={reaction.users.size}
                                highlight={reaction.users.includes(
                                    props.authid
                                )}
                                onClick={makeReactionClickHandler(reaction)}
                            />
                        ))}
                    </div>

                    {message.last_reply && <ReplyButton message={message} />}
                </div>

                <Menu
                    id={message.id}
                    open={hovering}
                    onPin={actions.onPin}
                    onReply={actions.onReply}
                    onReact={actions.onReact}
                    onDelete={actions.onDelete}
                    onBookmark={actions.onBookmark}
                    anchor={anchor.current!}
                    buttons={actions.buttons}
                    pinned={message.pinned}
                    bookmark={actions.bookmark}
                />
                {card}
            </div>
        </div>
    );
});
