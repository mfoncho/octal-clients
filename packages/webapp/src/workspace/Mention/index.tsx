import React from "react";
import clx from "classnames";
import { Text } from "@octal/ui";
import { UserRecord, TopicRecord, useTopic, useUser } from "@octal/store";

interface IMentioned {
    id: string;
}

interface IMentionUser {
    prefix: "@";
    selected: boolean;
    mention: { value: string; user: UserRecord };
}

interface IMentionTopic {
    prefix: "#";
    selected: boolean;
    mention: { value: string; topic: TopicRecord };
}

type IMention = IMentionTopic | IMentionUser;

export function UserMentioned({ id }: IMentioned) {
    const user = useUser(id);

    return (
        <span className="px-1 pb-0.5 my-0.5 bg-primary-500 text-white rounded-full font-semibold text-sm">
            @<Text>{user.username}</Text>
        </span>
    );
}

export function TopicMentioned({ id }: IMentioned) {
    const topic = useTopic(id);
    return (
        <span className="px-1 pb-0.5 my-0.5 bg-primary-100 rounded text-primary-800 font-semibold text-sm">
            #<Text>{topic.name}</Text>
        </span>
    );
}

export function Mentioned({ attributes, children, element }: any) {
    const id = element.value.slice(1);
    let mentioned: any = null;
    switch (element.prefix) {
        case "@":
            mentioned = <UserMentioned id={id} />;
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

export default function Mention({ prefix, selected, mention }: IMention) {
    switch (prefix) {
        case "@":
            const { user } = mention as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white p-2",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <div className="font-bold flex flex-row items-center">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="inline-block h-8 w-8 rounded-full mr-2"
                        />
                        <span className="font-bold flex flex-row items-center">
                            <span>{prefix}</span>
                            <span>
                                <Text>{user.username}</Text>
                            </span>
                        </span>
                    </div>
                    <span>{user.name}</span>
                </div>
            );

        case "#":
            const { topic } = mention as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white p-2",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <span className="font-bold flex flex-row items-center">
                        <span className="px">{prefix}</span>
                        <span>
                            <Text>{topic.name}</Text>
                        </span>
                    </span>
                </div>
            );

        default:
            return <span>{mention.value}</span>;
    }
}
