import React, { useEffect } from "react";
import * as Icons from "@octal/icons";
import { useInput } from "src/hooks";
import { Button, Dialog } from "@octal/ui";
import { useDebouncedCallback } from "@octal/hooks";
import { MemberRecord, LabelRecord } from "@octal/store";
import MembersPopper from "@workspace/Space/MembersPopper";
import { useBoard, useBoardActions } from "./hooks";
import LabelsPopper from "./LabelsPopper";

export default React.memo(() => {
    const { filter } = useBoard();
    const input = useInput(filter.term);
    const actions = useBoardActions();
    const labelBtn = React.useRef<HTMLButtonElement | null>();
    const memberBtn = React.useRef<HTMLButtonElement | null>();
    const dialog = Dialog.useDialog();

    const callback = useDebouncedCallback(
        () => {
            actions.filter("term", input.value);
        },
        1000,
        [input.value]
    );

    useEffect(() => {
        callback();
    }, [input.value]);

    function handleSelectMember(member: MemberRecord) {
        if (filter.users.includes(member.user_id)) {
            actions.filter(
                "users",
                filter.users
                    .filter((id) => id !== member.user_id)
                    .toJS() as string[]
            );
        } else {
            actions.filter(
                "users",
                filter.users.push(member.user_id).toJS() as string[]
            );
        }
    }

    function handleSelectLabel(label: LabelRecord) {
        if (filter.labels.includes(label.id)) {
            actions.filter(
                "labels",
                filter.labels.filter((id) => id !== label.id).toJS() as string[]
            );
        } else {
            actions.filter(
                "labels",
                filter.labels.push(label.id).toJS() as string[]
            );
        }
    }

    return (
        <div className="flex px-12 flex-row items-center h-14 sm:h-20 space-x-3">
            <div className="relative hidden sm:flex items-center">
                <input
                    {...input.props}
                    placeholder="Quick search board"
                    className="pl-8 font-semibold outline-none placeholder:text-gray-400 bg-transparent text-gray-700 focus:ring-primary-500 ring-gray-400 ring-2 rounded py-1 px-2"
                />
                <div className="px-2 absolute">
                    <Icons.Filter className="text-gray-500" />
                </div>
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
                selected={filter.labels.toJS() as any}
                onSelect={handleSelectLabel}
                anchorEl={labelBtn.current}
                open={dialog.labels}
                onClickAway={dialog.close}
            />
            <MembersPopper
                selected={filter.users.toJS() as any}
                onSelect={handleSelectMember}
                anchorEl={memberBtn.current}
                open={dialog.members}
                onClickAway={dialog.close}
            />
        </div>
    );
});
