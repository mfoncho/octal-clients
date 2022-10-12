import React from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import * as Icons from "@colab/icons";
import { Text } from "@colab/ui";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import { useTopic } from "@colab/store";

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

    if (topic.is_archived && !selected) {
        return <React.Fragment />;
    }

    return (
        <Link
            to={path}
            className={clx(
                "flex px-2 py-1 flex-row items-center",
                selected
                    ? "bg-primary-500 text-white"
                    : "text-primary-200 hover:bg-primary-800"
            )}>
            <Icons.Topic className="w-5 h-5 mx-1" />
            <span
                className={clx(
                    "pl-2 font-semibold text-sm flex-inline flex-grow overflow-x-hidden",
                    {
                        ["text-primary-200"]: !selected,
                    }
                )}>
                <Text>{topic!.name}</Text>
            </span>
            <Counter id={topic.thread_id} />
        </Link>
    );
});
