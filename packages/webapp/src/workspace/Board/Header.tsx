import React from "react";
import { Button, Dialog, Text } from "@octal/ui";
import { useBoard, useDrawer } from "./hooks";
import StashDialog from "./StashDialog";
import RenameBoardDialog from "./RenameBoardDialog";
import { HiMenuAlt4 as MenuIcon } from "react-icons/hi";
import { RiArchiveDrawerFill as DrawerIcon } from "react-icons/ri";
import { useNavigatorDrawer } from "src/hooks";

const ArchiveIcon = React.memo(() => (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path
            fillRule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
        />
    </svg>
));

const SearchIcon = () => (
    <svg width="24" height="24" fill="none" className="text-gray-400">
        <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"></path>
    </svg>
);

export default React.memo(() => {
    const board = useBoard();
    const [, navbar] = useNavigatorDrawer();
    const [drawer, drawerActions] = useDrawer(board.id);
    const dialog = Dialog.useDialog();

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

    return (
        <header className="flex border-b flex-none border-gray-200 flex-row items-center h-14 sm:h-20  justify-between">
            <div className="flex flex-row items-center pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={handleToggleDrawer}
                    className="visible sm:hidden">
                    <MenuIcon />
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
                    onClick={dialog.opener("stash")}>
                    <DrawerIcon />
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
                    <ArchiveIcon />
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
