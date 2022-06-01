import React, { useState, useRef, useMemo } from "react";
import clx from "classnames";
import moment from "moment";
import { io } from "@octal/client";
import * as Icons from "@octal/icons";
import Reply from "./Reply";
import Menu, { ActionT } from "./Menu";
import ReplyButton from "./ReplyButton";
import Reaction from "./Reaction";
import emoji from "@octal/emoji";
import { Markdown, Text } from "@octal/ui";
import UserCard from "@workspace/UserCard";
import { MessageRecord } from "@octal/store/lib/records";

export interface ISearchMessage {
    message: io.Message;
}

const messageActions: ActionT[] = [];

export default React.memo<ISearchMessage>((props) => {
    const anchor = useRef<HTMLDivElement>(null);

    const author = props.message.author;

    const message = useMemo(() => {
        return new MessageRecord({ ...props.message });
    }, []);

    return (
        <div
            className={clx(
                "flex flex-col py-2 relative group hover:bg-gray-100 border-2 border-gray-100 rounded-md"
            )}>
            {message.reply_id && message.flagged && (
                <Reply id={message.reply_id} />
            )}
            <div className="flex flex-row">
                <div className="flex flex-none justify-center flex-row w-16">
                    <img
                        role="button"
                        alt={author.name}
                        src={author.avatar}
                        className="rounded-full w-[40px] h-[40px]"
                    />
                </div>

                <div className="flex flex-grow flex-col">
                    <div className="flex flex-row items-center">
                        <div className="text-base font-bold">
                            {author.username}
                        </div>
                        <span className="px-2 font-bold text-gray-500">·</span>
                        <span className="text-xs select-none pt-1 font-semibold text-gray-500">
                            {moment(message.timestamp as any).format("ll")}
                        </span>
                    </div>

                    <div className="flex flex-col" ref={anchor}>
                        <div className="flex flex-row text-gray-600 space-x-2">
                            {message.pinned && (
                                <Icons.Pin className="h-2.5 w-2.5" />
                            )}
                            {message.flagged && (
                                <Icons.Bookmark className="h-2.5 w-2.5" />
                            )}
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
                </div>

                <Menu
                    id={message.id}
                    open={false}
                    anchor={anchor.current!}
                    buttons={messageActions}
                    pinned={message.pinned}
                    flagged={message.flagged}
                />
            </div>
        </div>
    );
});
