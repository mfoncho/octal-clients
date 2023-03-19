import React from "react";
import { Button, Dialog, Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useSpace, useDrawer } from "./hooks";
import StashDialog from "./StashDialog";
import { usePermissions } from "../Space";
import Templates from "./Templates";
import { useNavigatorDrawer } from "src/hooks";

const drawerName = "board.archive";

export default React.memo(() => {
    const space = useSpace();
    const [, navbar] = useNavigatorDrawer();
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
                            <Text>{space.name}</Text>
                        </p>
                    </button>
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
        </header>
    );
});
