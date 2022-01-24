import React from "react";
import { MemberRecord, useUser, useUsers } from "@octal/store";
import { useMembers } from "./hooks";
import { Popper } from "@octal/ui";

interface IMenu {
    selected?: string[];
    onSelect?: (member: MemberRecord) => void;
}

interface IMember {
    selected?: boolean;
    onClick?: (member: MemberRecord) => void;
    member: MemberRecord;
}

function Member({ member, onClick }: IMember) {
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
            className="flex flex-row items-center px-2 py-1 group hover:bg-primary-700">
            <img
                alt={user.username}
                className="w-8 h-8 rounded-full"
                src={user.avatar}
            />
            <div className="px-2 flex flex-col">
                <span className="font-bold text-gray-800 group-hover:text-white text-sm">
                    {user.username}
                </span>
                <span className="font-semibold text-xs group-hover:text-white text-gray-600">
                    {user.name}
                </span>
            </div>
        </div>
    );
}

export default Popper.create<HTMLUListElement, IMenu>(
    ({ selected = [], ...props }) => {
        const members = useMembers();

        let users = useUsers();

        const smembers = members.filter(
            (member) =>
                selected.includes(member.user_id) && users.has(member.user_id)
        );

        const unselected = members.filter((member) => {
            return users.has(member.user_id);
        });

        return (
            <Popper
                as="div"
                role="select"
                open={props.open}
                tabIndex={-1}
                distance={10}
                anchorEl={props.anchorEl}
                placement="bottom-start"
                onClickAway={props.onClickAway}
                className="z-10 focus:outline-none flex w-64 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 bg-white shadow-md overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col">
                    {!smembers.isEmpty() && (
                        <div className="flex flex-row  bg-gray-100 h-4" />
                    )}
                    {smembers
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
                <div className="flex flex-col">
                    <div className="flex flex-row  bg-gray-100 h-4" />
                    <div className="flex flex-col">
                        {unselected
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
                </div>
            </Popper>
        );
    }
);
