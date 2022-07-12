import React from "react";
import { Button, Dialog, Text } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useBoard, useDrawer } from "./hooks";
import StashDialog from "./StashDialog";
import { usePermissions } from "../Space";
import Templates from "./Templates";
import RenameBoardDialog from "./RenameBoardDialog";
import { useNavigatorDrawer } from "src/hooks";
import { useSpacePermissions } from "@octal/store";

export default React.memo(() => {
    const board = useBoard();
    const [, navbar] = useNavigatorDrawer();
    const [drawer, drawerActions] = useDrawer(board.id);
    const dialog = Dialog.useDialog();

    const permissions = usePermissions();

    function handleToggleArchive() {
        if (drawer.props.type != "archive" || !drawer.open) {
            drawerActions.open({ type: "archive", board_id: board.id });
        } else if (drawer.props.type == "archive" && drawer.open) {
            drawerActions.close({ type: "" });
        }
    }

    function handleToggleDrawer() {
        navbar.open({});
    }

    if (dialog.rename && permissions.get("space.manage", false) === false)
        dialog.close({} as any);

    return (
        <header className="flex border-b flex-none border-gray-200 flex-row items-center h-14 sm:h-20  justify-between bg-primary-50">
            <div className="flex flex-row items-center pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={handleToggleDrawer}
                    className="visible sm:hidden">
                    <Icons.Menu />
                </Button>
                <div className="flex flex-col justify-center px-2 overflow-hidden">
                    <button
                        onClick={dialog.opener("rename")}
                        className="text-left ">
                        <p
                            className="px-2 truncate text-lg font-bold"
                            onClick={dialog.opener("rename")}>
                            <Text>{board.name}</Text>
                        </p>
                    </button>
                </div>
            </div>
            <div className="flex flex-row items-center justify-end px-4">
                <Button
                    variant="icon"
                    className="mx-2"
                    onClick={dialog.opener("templates")}>
                    <Icons.Template />
                    <Templates
                        onClose={dialog.close}
                        open={dialog.templates}
                        board={board}
                    />
                </Button>
                <Button
                    variant="icon"
                    className="mx-2"
                    onClick={dialog.opener("stash")}>
                    <Icons.Drawer />
                    <StashDialog
                        onClose={dialog.close}
                        open={dialog.stash}
                        board={board}
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
            <RenameBoardDialog
                open={dialog.rename}
                board={board}
                onClose={dialog.close}
            />
        </header>
    );
});
