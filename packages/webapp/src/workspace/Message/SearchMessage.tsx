import React, { useRef, useMemo } from "react";
import clx from "classnames";
import moment from "moment";
import { io } from "@octal/client";
import * as Icons from "@octal/icons";
import Menu, { ActionT } from "./Menu";
import emoji from "@octal/emoji";
import { Markdown, Text } from "@octal/ui";
import { MessageRecord } from "@octal/store/lib/records";

export interface ISearchMessage {
    message: io.Message;
}

const messageActions: ActionT[] = ["jump"];

const Reply = React.memo<ISearchMessage>((props) => {
    const author = props.message.author;

    const message = useMemo(() => {
        return new MessageRecord({ ...props.message });
    }, []);

    let content = message.parsed;

    if (content.length > 1) {
        content = [content[0]];
    }

    return (
        <div className="flex flex-row relative rounded-t-md pr-2">
            <div className="flex flex-row items-end justify-end pl-8 w-16 h-[20px]">
                <div className="border-l-2 border-gray-500 rounded-tl-md border-t-2 w-[34px] h-[10px]" />
            </div>
            <div className="flex flex-row items-center space-x-1">
                <div
                    role="button"
                    className="w-max flex flex-row items-center justify-between">
                    <img
                        alt={author.name}
                        src={author.avatar}
                        className="rounded-full w-[20px] h-[20px]"
                    />
                    <button className="text-base font-bold text-primary-500 px-2">
                        {author.username}
                    </button>
                </div>
                <span className="w-fit line-clamp-1 text-msg max-h-[52px] text-ellipsis">
                    <Markdown>{content}</Markdown>
                </span>
            </div>
        </div>
    );
});

export default React.memo<ISearchMessage>((props) => {
    const anchor = useRef<HTMLDivElement>(null);

    const author = props.message.author;

    const message = useMemo(() => {
        return new MessageRecord({ ...props.message });
    }, []);

    function handleJump() {
        console.log(props.message);
    }

    return (
        <div
            className={clx(
                "flex flex-col py-3 relative group hover:bg-gray-100 border-2 border-gray-100 rounded-md"
            )}>
            {message.reply_id && props.message.reply && (
                <Reply message={props.message.reply} />
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
                    open={true}
                    anchor={anchor.current!}
                    onJump={handleJump}
                    buttons={messageActions}
                />
            </div>
        </div>
    );
});
