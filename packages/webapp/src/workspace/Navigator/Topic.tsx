import React from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import * as Icons from "@octal/icons";
import { Text } from "@octal/ui";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import { useTopic } from "@octal/store";

interface ITopic {
    id: string;
}

export default React.memo<ITopic>(({ id }) => {
    const topic = useTopic(id);

    const params = useParams<{ topic_id: string }>();

    const path = generatePath(paths.topic, {
        space_id: topic?.space_id,
        topic_id: topic?.id,
    });

    const selected = params.topic_id == id;

    return (
        <Link
            to={path}
            className={clx(
                "flex px-2 py-1 flex-row items-center",
                selected
                    ? "bg-primary-500 text-white"
                    : "text-gray-500 hover:bg-slate-200"
            )}>
            <Icons.Topic className="w-5 h-5 mx-1" />
            <span
                className={clx(
                    "pl-2 font-semibold text-sm flex-inline flex-grow overflow-x-hidden",
                    {
                        ["text-gray-500"]: !selected,
                    }
                )}>
                <Text>{topic!.name}</Text>
            </span>
            <Counter id={topic.thread_id} />
        </Link>
    );
});
