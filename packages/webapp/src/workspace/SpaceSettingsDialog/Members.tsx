import React, { useState } from "react";
import * as Icons from "@octal/icons";
import Layout from "./Layout";
import { SpaceManagerFilterParams } from ".";
import UsersDialog from "../UsersDialog";
import MembersIcon from "@material-ui/icons/PeopleRounded";
import { Promiseable } from "@octal/common";
import { Markdown, Avatar, Dialog, Button } from "@octal/ui";
import { useMembers, useUser } from "@octal/store";
import { deleteMember, createMember } from "@octal/store/lib/actions/member";
import { useDispatch } from "react-redux";
import {
    MemberRecord,
    SpaceRecord,
    UserRecord,
} from "@octal/store/lib/records";

interface IMember {
    space: SpaceRecord;
    member: MemberRecord;
    onDelete: (member: MemberRecord) => Promiseable;
}

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    loading: boolean;
    children: React.ReactNode;
}

function warningText(space: SpaceRecord, user: UserRecord) {
    return `If you remove __${user.name}__ from __${space.name}__, they will no longer be able to see any of its messages. To rejoin the space, they will have to be re-invited.

Are you sure you wish to do this?`;
}

const WarningDialog = Dialog.create<IWarning>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Remove Member"
            confirm="Remove"
            onClose={props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm}>
            {props.children}
        </Dialog.Warning>
    );
});

function Row({ member, space, onDelete }: IMember) {
    const [loading, setLoading] = useState(false);

    const [warning, setWarning] = useState<boolean>(false);

    const user = useUser(member.user_id);

    function handleCloseWarning() {
        setWarning(false);
    }

    function handleDelete() {
        setLoading(true);
        onDelete(member).catch(() => setLoading(false));
    }

    function handleOpenWarning(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setWarning(true);
    }

    const userNode = (
        <div className="flex flex-row items-center">
            <Avatar alt={user.name} src={user.avatar} />
            <div className="flex flex-col px-2">
                <span className="font-semibold text-base text-gray-800">
                    {user.name}
                </span>
                <span className="font-semibold text-sm text-gray-600">
                    {user.name}
                </span>
            </div>
        </div>
    );

    return (
        <div className="group flex px-4 py-1 flex-row items-center justify-between mb-2 hover:bg-cool-gray-50">
            {userNode}
            <button
                onClick={loading ? undefined : handleOpenWarning}
                className="invisible group-hover:visible text-gray-500 rounded-full mx-2 border border-gray-500 p-1 hover:bg-gray-200">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                </svg>
            </button>
            <WarningDialog
                open={Boolean(warning)}
                loading={loading}
                onConfirm={handleDelete}
                onClose={handleCloseWarning}>
                <div className="flex flex-col">
                    {userNode}
                    <div className="py-4 text-base text-gray-800">
                        <Markdown>{warningText(space, user)}</Markdown>
                    </div>
                </div>
            </WarningDialog>
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerFilterParams) => {
    const dispatch = useDispatch();

    const [selected, setSelected] = useState<string[]>([]);

    const dialog = Dialog.useDialog();

    const members = useMembers(space.id);

    React.useEffect(() => {
        const selected = members
            .map((member) => member.user_id)
            .toList()
            .toJS() as any;
        setSelected(selected);
    }, [members]);

    function handleDeleteMember(member: MemberRecord) {
        const action = deleteMember({
            member_id: member.id,
            space_id: space.id,
        });
        return dispatch(action);
    }

    function handleAddUser(id: string) {
        if (!selected.includes(id)) {
            console.log(id);
            const action = createMember({ space_id: space.id, user_id: id });
            dispatch(action);
        }
    }

    return (
        <Layout title="Space Members" className="flex flex-col">
            <div className="flex flex-row justify-end pb-4">
                <div className="relative flex flex-row item-center">
                    <input className="form-input font-semibold rounded-md text-sm text-gray-800 px-10 border shadow-sm border-gray-300" />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Search className="text-gray-500 w-5 h-5" />
                    </div>
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
                </div>
            </div>
            <div className="flex flex-col border-2 border-gray-200 rounded-lg py-4">
                {members.toList().map((member) => (
                    <Row
                        space={space}
                        key={member.id}
                        member={member}
                        onDelete={handleDeleteMember}
                    />
                ))}
            </div>
            <UsersDialog
                open={dialog.users}
                onClose={dialog.close}
                selected={selected}
                onSelect={handleAddUser}
            />
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Members";

export default {
    name: name,
    icon: MembersIcon,
    filter: filter,
    manager: Manager,
};
