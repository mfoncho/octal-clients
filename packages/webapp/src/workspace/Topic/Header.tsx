import React from "react";
import { Dialog, Text, Button } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useTopic } from "@octal/store";
import RenameTopicDialog from "./RenameTopicDialog";
import InviteDialog from "../InviteDialog";
import { useParams } from "react-router-dom";
import { useSpace } from "../Space/hooks";
import { HiMenuAlt4 as MenuIcon } from "react-icons/hi";
import { useNavigatorDrawer } from "src/hooks";

export default React.memo(() => {
    const [, navigator] = useNavigatorDrawer();
    const space = useSpace();
    const dialog = Dialog.useDialog();
    const params = useParams<{ topic_id: string }>();
    const topic = useTopic(params.topic_id);
    return (
        <header className="flex flex-none border-b border-gray-200 flex-row items-center h-14 sm:h-20 justify-between">
            <div className="flex flex-row items-center pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={() => navigator.toggle({})}
                    className="visible sm:hidden">
                    <MenuIcon />
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
                <button
                    onClick={dialog.opener("invite")}
                    className="mx-4 text-gray-500 flex flex-grow items-center">
                    <Icons.Search />
                    <span className="pl-4 font-semibold">
                        Quick search board
                    </span>
                </button>
            </div>
            {topic && (
                <>
                    <RenameTopicDialog
                        topic={topic}
                        open={dialog.rename}
                        onClose={dialog.close}
                    />
                    <InviteDialog
                        space={space}
                        open={dialog.invite}
                        onClose={dialog.close}
                    />
                </>
            )}
        </header>
    );
});
