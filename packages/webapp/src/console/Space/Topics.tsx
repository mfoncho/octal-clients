import React from "react";
import { io } from "@console/types";
import moment from "moment";
import client from "@console/client";
import * as Icons from "@octal/icons";
import { Text } from "@octal/ui";

export interface ITopics {
    space: io.Space;
}

export default function Topics({ space }: ITopics) {
    const [topics, setTopics] = React.useState<io.Topic[]>([]);

    React.useEffect(() => {
        if (space) {
            loadTopic();
        }
    }, [space.id]);

    async function loadTopic() {
        return client
            .fetchSpaceTopics({ space_id: space.id })
            .then((data) => setTopics(data))
            .catch(() => {});
    }
    function renderTopic(topic: io.Topic) {
        return (
            <div
                key={topic.id}
                className="flex justify-between text-gray-500 flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="flex flex-row items-center">
                    <Icons.Topic />
                    <span className="px-4 text-gray-800 font-semibold text-base">
                        <Text>{topic.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="font-semibold text-sm">
                        {moment(topic.created_at).format("ll")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col my-4 border-2 rounded-md border-gray-200">
            <div className="py-4 bg-gray-100 flex flex-row justify-between">
                <span className="font-bold px-4 text-gray-800">Topics</span>
            </div>
            <div>{topics.map(renderTopic)}</div>
        </div>
    );
}
