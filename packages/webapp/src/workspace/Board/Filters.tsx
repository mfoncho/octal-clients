import React from "react";
import * as Icons from "@octal/icons";
import LabelsPopper from "./LabelsPopper";
import MembersPopper from "@workspace/Space/MembersPopper";
import { Button, Dialog, Popper } from "@octal/ui";
import { useBoard } from "./hooks";

const SearchIcon = () => (
    <svg width="24" height="24" fill="none" className="text-gray-500">
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
    const labelBtn = React.useRef<HTMLButtonElement | null>();
    const memberBtn = React.useRef<HTMLButtonElement | null>();
    const dialog = Dialog.useDialog();

    return (
        <div className="flex px-8 flex-row items-center h-14 sm:h-20 space-x-3">
            <div className="hidden mx-4 sm:flex items-center rounded-md px-2 py-1 ring-primary-500 ring-2">
                <SearchIcon />
                <input
                    placeholder="Quick search board"
                    className="pl-2 font-semibold outline-none placeholder:text-gray-400 bg-transparent text-gray-700"
                />
            </div>
            <Button
                ref={labelBtn as any}
                onClick={dialog.opener("labels")}
                variant="icon"
                color="regular">
                <Icons.Field.Label />
            </Button>
            <Button
                ref={memberBtn as any}
                onClick={dialog.opener("members")}
                variant="icon"
                color="regular">
                <Icons.Users />
            </Button>
            <LabelsPopper
                anchorEl={labelBtn.current}
                open={dialog.labels}
                onClickAway={dialog.close}
            />
            <MembersPopper
                anchorEl={memberBtn.current}
                open={dialog.members}
                onClickAway={dialog.close}
            />
        </div>
    );
});
