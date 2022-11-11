import React from "react";
import { Dialog, Text, Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useTopic, useSpacePermissions } from "@colab/store";
import RenameTopicDialog from "./RenameTopicDialog";
import SearchDialog from "./Search";
import { useParams } from "react-router-dom";
import { useSpace } from "../Space/hooks";
import { useNavigatorDrawer } from "src/hooks";

export default React.memo(() => {
    const [, navigator] = useNavigatorDrawer();
    const space = useSpace();
    const dialog = Dialog.useDialog();
    const params = useParams<{ topic_id: string }>();
    const topic = useTopic(params.topic_id!);
    const permissions = useSpacePermissions(space.id);

    if (dialog.rename && permissions.get("space.manage", false) === false)
        dialog.close({} as any);

    return (
        <header className="flex flex-none border-b border-gray-200 flex-row items-center h-14 sm:h-20 justify-between bg-primary-50">
            <div className="flex flex-row items-center pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={() => navigator.toggle({})}
                    className="visible sm:hidden">
                    <Icons.Menu />
                </Button>
                <div className="flex flex-col justify-center px-2 overflow-hidden">
                    <button
                        onClick={dialog.opener("rename")}
                        className="text-left ">
                        <p className="truncate text-lg font-bold">
                            {topic && <Text>{topic.name}</Text>}
                        </p>
                    </button>
                </div>
            </div>
            <div className="hidden sm:flex flex-none flex-row items-center justify-end px-4">
                <div
                    role="button"
                    onClick={dialog.opener("search")}
                    className="mx-4 text-gray-500 flex flex-grow items-center">
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
        </header>
    );
});
