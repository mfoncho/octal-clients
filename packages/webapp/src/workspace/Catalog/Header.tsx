import React from "react";
import { Button, Dialog, Text } from "@colab/ui";
import * as Icons from "@colab/icons";
import Header from "../Header";
import { useCatalog, useDrawer } from "./hooks";
import StashDialog from "./StashDialog";
import { usePermissions } from "../Space";
import Templates from "./Templates";
import RenameCatalogDialog from "./RenameCatalogDialog";
import { useNavigatorDrawer } from "src/hooks";

export default React.memo(() => {
    const catalog = useCatalog();
    const [, navbar] = useNavigatorDrawer();
    const [drawer, drawerActions] = useDrawer(catalog.id);
    const dialog = Dialog.useDialog();

    const permissions = usePermissions();

    function handleToggleArchive() {
        if (drawer.props.type != "archive" || !drawer.open) {
            drawerActions.open({ type: "archive", catalog_id: catalog.id });
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
        <Header className="flex flex-grow flex-row items-center justify-between">
            <div className="flex flex-col justify-center px-6 overflow-hidden">
                <button
                    onClick={dialog.opener("rename")}
                    className="text-left ">
                    <p className="truncate text-lg font-bold dark:text-gray-200">
                        {catalog && <Text>{catalog.name}</Text>}
                    </p>
                </button>
            </div>
            <div className="hidden sm:flex flex-none flex-row items-center justify-end px-4">
                {permissions.get("catalog.manage") && (
                    <Button
                        variant="icon"
                        className="mx-2"
                        onClick={dialog.opener("templates")}>
                        <Icons.Template />
                        <Templates
                            onClose={dialog.close}
                            open={dialog.templates}
                            catalog={catalog}
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
                        catalog={catalog}
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
            <RenameCatalogDialog
                open={dialog.rename}
                catalog={catalog}
                onClose={dialog.close}
            />
        </Header>
    );
});
