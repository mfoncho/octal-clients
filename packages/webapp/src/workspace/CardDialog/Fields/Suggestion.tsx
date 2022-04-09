import React from "react";
import { Text } from "@octal/ui";
import clx from "classnames";
import { UserRecord, TopicRecord } from "@octal/store";

interface IMentionUser {
    prefix: "@";
    selected: boolean;
    value: { value: string; user: UserRecord };
}

interface IMentionTopic {
    prefix: "#";
    selected: boolean;
    value: { value: string; topic: TopicRecord };
}

type IMention = IMentionTopic | IMentionUser;

export default function Suggestion({ prefix, selected, value }: IMention) {
    switch (prefix) {
        case "@":
            const { user } = value as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white px-2 py-1",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <div className="font-bold flex flex-row items-center">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="inline-block h-5 w-5 rounded-full mr-2"
                        />
                        <span className="font-bold text-sm flex flex-row items-center">
                            <span>{prefix}</span>
                            <span>
                                <Text>{user.username}</Text>
                            </span>
                        </span>
                    </div>
                </div>
            );

        case "#":
            const { topic } = value as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white px-2 py-1",
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
            return (
                <span>
                    <Text>{(value as any).value}</Text>
                </span>
            );
    }
}
