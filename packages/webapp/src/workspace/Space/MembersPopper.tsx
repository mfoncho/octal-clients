import React from "react";
import { MemberRecord, useUser } from "@colab/store";
import { useMembers } from "./hooks";
import * as Icons from "@colab/icons";
import { Popper } from "@colab/ui";

interface IMenu {
    selected?: string[];
    placement?: string;
    portal?: boolean;
    onSelect?: (member: MemberRecord) => void;
}

interface IMember {
    selected?: boolean;
    onClick?: (member: MemberRecord) => void;
    member: MemberRecord;
}

const labelStyle = { margin: 0 };

function Member({ member, onClick, selected }: IMember) {
    const user = useUser(member.user_id);
    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (onClick) {
            onClick(member);
        }
    }
    return (
        <div
            onClick={handleClick}
            role="button"
            className="hover:bg-slate-100 flex flex-row items-center p-2 group hover:bg-primary-700 justify-between">
            <div className="flex flex-row space-x-2">
                <img
                    alt={user.username}
                    className="w-9 h-9 rounded-full"
                    src={user.avatar}
                />
                <div className=" flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">
                        {user.username}
                    </span>
                    <span className="font-semibold text-xs text-gray-600">
                        {user.name}
                    </span>
                </div>
            </div>
            {selected && <Icons.Check />}
        </div>
    );
}

export default Popper.create<HTMLUListElement, IMenu>(
    ({ selected = [], ...props }) => {
        const members = useMembers();

        return (
            <Popper
                as="div"
                role="select"
                open={props.open}
                tabIndex={-1}
                style={labelStyle}
                anchorEl={props.anchorEl}
                placement={(props.placement as any) ?? "bottom-start"}
                onClickAway={props.onClickAway}
                className="z-10 focus:outline-none flex w-64 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-64 bg-white shadow-md overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col divide-y dark:divide-slate-200/5">
                    {members
                        .map((member) => (
                            <Member
                                key={member.id}
                                member={member}
                                onClick={props.onSelect}
                                selected={selected.includes(member.user_id)}
                            />
                        ))
                        .toList()}
                </div>
            </Popper>
        );
    }
);
