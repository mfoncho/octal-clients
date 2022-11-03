import React from "react";
import { Text } from "@colab/ui";
import clx from "classnames";
import { UserRecord, TopicRecord } from "@colab/store";

interface IValue {
    value: string;
    topic: TopicRecord;
    user: UserRecord;
    native: string;
}

interface ISuggestion {
    type: string;
    term: string;
    suggestion: string;
    selected: boolean;
    value: IValue;
}

export default function Suggestion({
    suggestion,
    selected,
    value,
}: ISuggestion) {
    switch (suggestion) {
        case "user":
            const { user } = value;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white px-2 py-1 min-w-[250px]",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <div className="font-bold flex flex-row items-center">
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="inline-block h-5 w-5 rounded-full mr-2"
                        />
                        <span className="font-bold text-sm flex flex-row items-center">
                            <span>@</span>
                            <span>
                                <Text>{user.username}</Text>
                            </span>
                        </span>
                    </div>
                </div>
            );

        case "topic":
            const { topic } = value;
            return (
                <div
                    className={clx(
                        "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white px-2 py-1 min-w-[250px]",
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
                        "flex flex-row justify-between rounded w-full hover:bg-primary-100 hover:text-white p-2 min-w-[250px]",
                        { ["bg-primary-500 text-white"]: selected }
                    )}>
                    <span className="font-bold flex flex-row items-center">
                        <Text>{value.native}</Text>
                    </span>
                    <span className="text-gray-600 text-sm">
                        {(value as any).colons}
                    </span>
                </div>
            );

        default:
            // Should never reach here
            return <span />;
    }
}
