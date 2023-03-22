import React from "react";
import { Dialog, Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import Header from "../Header";
import { useSpacePermissions, useThread } from "@colab/store";
import SearchDialog from "./Search";
import { useParams } from "react-router-dom";
import { useSpace } from "../Space/hooks";
import paths from "src/paths/workspace";
import { Link, generatePath } from "react-router-dom";

export default React.memo(() => {
    const space = useSpace();
    const dialog = Dialog.useDialog();
    const boardPath = generatePath(paths.board, { space_id: space.id });
    const params = useParams<{ thread_id: string }>();
    const thread = useThread(params.thread_id!);
    const permissions = useSpacePermissions(space.id);

    if (dialog.rename && permissions.get("space.manage", false) === false)
        dialog.close({} as any);

    return (
        <Header className="flex flex-grow flex-row items-center justify-between">
            <div className="flex-1 flex flex-col justify-center px-6 overflow-hidden">
                <p className="truncate text-lg font-bold dark:text-gray-100">
                    {thread && <Text>{space.name}</Text>}
                </p>

                <div className="hidden sm:flex flex-row items-center">
                    <Link
                        to={boardPath}
                        className="text-gray-500 dark:text-gray-400 flex flex-grow items-center">
                        <Icons.Board />
                        <span className="pl-2 font-semibold">Board</span>
                    </Link>
                </div>
            </div>
            <div className="flex-none hidden sm:flex flex-row items-center justify-end px-4">
                <div
                    role="button"
                    onClick={dialog.opener("search")}
                    className="mx-4 text-gray-500 dark:text-gray-400 flex flex-grow items-center">
                    <Icons.Search />
                    <span className="pl-4 font-semibold">Quick search</span>
                </div>
            </div>
            {thread && (
                <React.Fragment>
                    <SearchDialog
                        open={dialog.search}
                        onClose={dialog.close}
                        thread={thread}
                    />
                </React.Fragment>
            )}
        </Header>
    );
});
