import React from "react";
import clx from "classnames";
import { Link, generatePath, useParams } from "react-router-dom";
import * as Icons from "@colab/icons";
import { Text } from "@colab/ui";
import paths from "src/paths/workspace";
import Counter from "./Counter";
import { useThread } from "@colab/store";

interface ITopic {
    id: string;
}

export default React.memo<ITopic>(({ id }) => {
    const thread = useThread(id);
    const params = useParams<{ thread_id: string }>();

    const path = generatePath(paths.thread, {
        space_id: thread?.space_id,
        thread_id: thread?.id,
    });

    const selected = params.thread_id == id;

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
                <Text>{thread!.name}</Text>
            </span>
            <Counter id={params.thread_id!} />
        </Link>
    );
});
