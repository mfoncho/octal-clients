import React from "react";
import clx from "classnames";
import { Text } from "@octal/ui";
import { UserRecord, TopicRecord } from "@octal/store";

interface ISuggestion<T = TopicRecord | UserRecord> {
    type: string;
    term: string;
    suggestion: string;
    selected: boolean;
    value: { value: string; topic: T };
}

export default function Suggestion({
    suggestion,
    selected,
    value,
}: ISuggestion) {
    switch (suggestion) {
        case "user":
            const { user } = value as any;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-200 hover:text-white p-2 min-w-[250px]",
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
                        "flex flex-row justify-between rounded w-full hover:bg-primary-200 hover:text-white p-2 min-w-[250px]",
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
                        "flex flex-row justify-between rounded w-full hover:bg-primary-100 hover:text-white p-2 justify-between min-w-[250px]",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <span className="font-bold flex flex-row items-center">
                        <Text>{(value as any).native}</Text>
                    </span>
                    <span className="text-gray-600 text-sm">
                        {(value as any).colons}
                    </span>
                </div>
            );

        default:
            //should never reach here
            return <span />;
    }
}
