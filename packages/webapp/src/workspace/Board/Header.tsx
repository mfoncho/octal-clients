import React from "react";
import { Button, Dialog, Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useSpace, useDrawer } from "./hooks";
import StashDialog from "./StashDialog";
import { usePermissions } from "../Space";
import Header from "../Header";
import Templates from "./Templates";
import { useNavigatorDrawer } from "src/hooks";
import paths from "src/paths/workspace";
import { Link, generatePath } from "react-router-dom";

const drawerName = "board.archive";

export default React.memo(() => {
    const space = useSpace();
    const [, navbar] = useNavigatorDrawer();
    const threadPath = generatePath(paths.thread, {
        space_id: space.id,
        thread_id: space.thread_id,
    });
    const [drawer, drawerActions] = useDrawer(space.id);
    const dialog = Dialog.useDialog();

    const permissions = usePermissions();

    function handleToggleArchive() {
        if (drawer.props.type != drawerName || !drawer.open) {
            drawerActions.open({ type: drawerName, space_id: space.id });
        } else if (drawer.props.type == drawerName && drawer.open) {
            drawerActions.close({ type: "" });
        }
    }

    function handleToggleDrawer() {
        navbar.open({});
    }

    if (dialog.rename && permissions.get("space.manage", false) === false)
        dialog.close({} as any);

    return (
        <Header className="flex flex-grow flex-row items-center justify-between">
            <div className="flex-1 flex flex-col justify-center px-6 overflow-hidden">
                <p className="truncate text-lg font-bold dark:text-gray-100">
                    <Text>{space.name}</Text>
                </p>
                <div className="hidden sm:flex flex-row items-center">
                    <Link
                        to={threadPath}
                        className="text-gray-500 dark:text-gray-400 flex flex-grow items-center">
                        <Icons.ChatBubbles />
                        <span className="pl-2 font-semibold">Thread</span>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row items-center justify-end px-4">
                {permissions.get("board.manage") && (
                    <Button
                        variant="icon"
                        className="mx-2"
                        onClick={dialog.opener("templates")}>
                        <Icons.Template />
                        <Templates
                            onClose={dialog.close}
                            open={dialog.templates}
                            space={space}
                        />
                    </Button>
                )}
                <Button
                    variant="icon"
                    className="mx-2"
                    onClick={dialog.opener("stash")}>
                    <Icons.Drawer />
                    <StashDialog
                        onClose={dialog.close}
                        open={dialog.stash}
                        space={space}
                    />
                </Button>
                <Button
                    variant="icon"
                    color={
                        drawer.props?.type == "stash" ? "primary" : undefined
                    }
                    className="mx-2"
                    onClick={handleToggleArchive}>
                    <Icons.Archives className="w-5 h-5" />
                </Button>
            </div>
        </Header>
    );
});
