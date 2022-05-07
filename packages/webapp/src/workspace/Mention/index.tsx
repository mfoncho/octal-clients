import React from "react";
import clx from "classnames";
import { Text } from "@octal/ui";
import Username from "@workspace/Username";
import { UserRecord, TopicRecord, useTopic } from "@octal/store";

interface IMentioned {
    id: string;
}

interface IMention<T = TopicRecord | UserRecord> {
    type: string;
    term: string;
    suggestion: string;
    selected: boolean;
    value: { value: string; topic: T };
}

export function TopicMentioned({ id }: IMentioned) {
    const topic = useTopic(id);
    return (
        <span className="px-1 pb-0.5 my-0.5 bg-primary-100 rounded text-primary-800 font-semibold text-sm">
            #<Text>{topic.name}</Text>
        </span>
    );
}

export function Mention({ attributes, children, element }: any) {
    const id = element.value.substring(1);
    let mentioned: any = null;
    switch (element.value[0]) {
        case "@":
            mentioned = <Username id={id} />;
            break;

        case "#":
            mentioned = <TopicMentioned id={id} />;
            break;

        default:
            mentioned = <span>#(:-|)</span>;
    }
    return (
        <span {...attributes} contentEditable={false}>
            {mentioned}
            {children && <span>{children}</span>}
        </span>
    );
}

export default function Suggestion({ suggestion, selected, value }: IMention) {
    switch (suggestion) {
        case "user":
            const { user } = value as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-200 hover:text-white p-2",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <div className="font-bold flex flex-row items-center">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="inline-block h-8 w-8 rounded-full mr-2"
                        />
                        <span className="font-bold flex flex-row items-center">
                            <span>@</span>
                            <span>
                                <Text>{user.username}</Text>
                            </span>
                        </span>
                    </div>
                    <span>{user.name}</span>
                </div>
            );

        case "topic":
            const { topic } = value as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-200 hover:text-white p-2",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <span className="font-bold flex flex-row items-center">
                        <span className="px">#</span>
                        <span>
                            <Text>{topic.name}</Text>
                        </span>
                    </span>
                </div>
            );

        case "emoji":
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-100 hover:text-white p-2",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <span className="font-bold flex flex-row items-center">
                        <Text>{(value as any).native}</Text>
                    </span>
                </div>
            );

        default:
            //should never reach here
            return <span />;
    }
}
