import React, { useState } from "react";
import * as Icons from "@octal/icons";
import Layout from "./Layout";
import { SpaceManagerFilterParams } from ".";
import UsersDialog from "../UsersDialog";
import client, { io } from "@octal/client";
import { Avatar, Dialog, Button } from "@octal/ui";
import { useDispatch } from "react-redux";
import { useInput } from "src/utils";
import { SpaceRecord, Actions } from "@octal/store";

interface IMember {
    space: SpaceRecord;
    filter: string;
    member: io.Member;
    onDelete?: (member: io.Member) => void;
}

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

function Row({ member, space, filter, onDelete }: IMember) {
    const [warning, setWarning] = useState<boolean>(false);

    if (
        filter.length > 0 &&
        !(
            member.user.name.includes(filter) ||
            member.user.username.includes(filter)
        )
    )
        return null;

    function handleCloseWarning() {
        setWarning(false);
    }

    function handleDelete() {
        if (onDelete) {
            onDelete(member);
        }
    }

    function handleOpenWarning(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setWarning(true);
    }

    const userNode = (
        <div className="flex flex-row items-center space-x-4">
            <Avatar alt={member.user.username} src={member.user.avatar} />
            <div className="flex flex-col">
                <span className="font-semibold text-base text-gray-800">
                    {member.user.username}
                </span>
                <span className="font-semibold text-xs text-gray-500">
                    {member.user.name}
                </span>
            </div>
        </div>
    );

    return (
        <div className="group flex px-4 py-2 flex-row items-center justify-between hover:bg-slate-100">
            {userNode}
            {space.admin_id !== member.user.id && onDelete && (
                <button
                    onClick={handleOpenWarning}
                    className="invisible group-hover:visible text-gray-500 rounded-md border border-gray-500 p-1 hover:bg-gray-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                    </svg>
                </button>
            )}

            <Dialog.Warning
                open={Boolean(warning)}
                title="Remove User"
                onClose={handleCloseWarning}
                onConfirm={handleDelete}>
                <div className="flex flex-col">{userNode}</div>
            </Dialog.Warning>
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerFilterParams) => {
    const dispatch = useDispatch();

    const [selected, setSelected] = useState<string[]>([]);

    const [members, setMembers] = useState<io.Member[]>([]);

    const dialog = Dialog.useDialog();

    const filter = useInput("");

    React.useEffect(() => {
        setSelected(members.map((member) => member.user.id));
    }, [members]);

    React.useEffect(() => {
        client.fetchSpaceMembers(space.id).then(setMembers);
    }, [space.id]);

    function handleDeleteMember(member: io.Member) {
        const action = Actions.Member.deleteMember({
            member_id: member.id,
            space_id: space.id,
        });
        dispatch(action);
        setMembers((members) => members.filter(({ id }) => member.id !== id));
    }

    function handleAddUser(id: string) {
        if (!selected.includes(id)) {
            const action = Actions.Member.createMember({
                space_id: space.id,
                user_id: id,
            });
            dispatch(action).then((data) =>
                setMembers((members) => [data].concat(members))
            );
        }
    }

    return (
        <Layout title="Members" className="flex flex-col">
            <div className="flex flex-row justify-end pb-4">
                <div className="relative flex flex-row item-center">
                    <input
                        {...filter.props}
                        className="form-input font-semibold rounded-md text-sm text-gray-800 px-10 border shadow-sm border-gray-300"
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Filter className="text-gray-500 w-5 h-5" />
                    </div>
                    {!space.is_common && (
                        <div className="absolute px-1 right-0 h-full flex flex-col justify-center">
                            <Button
                                onClick={dialog.opener("users")}
                                color="primary"
                                variant="icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col rounded-md border-gray-200 border divide-y divide-solid">
                {members.map((member) => (
                    <Row
                        space={space}
                        key={member.id}
                        member={member}
                        filter={filter.value}
                        onDelete={
                            space.is_common ? undefined : handleDeleteMember
                        }
                    />
                ))}
            </div>
            {!space.is_common && (
                <UsersDialog
                    open={dialog.users}
                    onClose={dialog.close}
                    selected={selected}
                    onSelect={handleAddUser}
                />
            )}
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Members";

export default {
    name: name,
    filter: filter,
    manager: Manager,
};
