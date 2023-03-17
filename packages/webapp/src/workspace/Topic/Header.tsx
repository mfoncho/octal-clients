import React from "react";
import { Dialog, Text, Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import Header from "../Header";
import { useSpacePermissions, useThread } from "@colab/store";
import RenameThreadDialog from "./RenameThreadDialog";
import SearchDialog from "./Search";
import { useParams } from "react-router-dom";
import { useSpace } from "../Space/hooks";

export default React.memo(() => {
    const space = useSpace();
    const dialog = Dialog.useDialog();
    const params = useParams<{ topic_id: string }>();
    const topic = useTopic(params.topic_id!);
    const permissions = useSpacePermissions(space.id);

    if (dialog.rename && permissions.get("space.manage", false) === false)
        dialog.close({} as any);

    return (
        <Header className="flex flex-grow flex-row items-center justify-between">
            <div className="flex flex-col justify-center px-6 overflow-hidden">
                <button
                    onClick={dialog.opener("rename")}
                    className="text-left ">
                    <p className="truncate text-lg font-bold dark:text-gray-200">
                        {thread && <Text>{space.name}</Text>}
                    </p>
                </button>
            </div>
            <div className="hidden sm:flex flex-none flex-row items-center justify-end px-4">
                <div
                    role="button"
                    onClick={dialog.opener("search")}
                    className="mx-4 text-gray-500 dark:text-gray-400 flex flex-grow items-center">
                    <Icons.Search />
                    <span className="pl-4 font-semibold">
                        Quick search topic
                    </span>
                </div>
            </div>
            {topic && (
                <>
                    <RenameTopicDialog
                        topic={topic}
                        open={dialog.rename}
                        onClose={dialog.close}
                    />
                    <SearchDialog
                        open={dialog.search}
                        onClose={dialog.close}
                        topic={topic}
                    />
                </>
            )}
        </Header>
    );
});
