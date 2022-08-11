import React from "react";
import * as Icons from "@octal/icons";
import { io } from "@console/types";
import { Dialog, Button } from "@octal/ui";
import { useNavigator } from "@console/hooks";
import moment from "moment";
import client from "@console/client";
import UsersDialog from "src/workspace/UsersDialog";

export interface IMembers {
    role: io.Role;
}

export default function Members({ role }: IMembers) {
    const navigator = useNavigator();

    const dialog = Dialog.useDialog();

    const [loading, setLoading] = React.useState<string[]>([]);
    const [excludes, setExcludes] = React.useState<string[]>([]);

    const [rusers, setRUsers] = React.useState<io.RoleUser[]>([]);

    React.useEffect(() => {
        if (role) {
            loadTopic();
        }
    }, [role.id]);

    React.useEffect(() => {
        setExcludes(() => rusers.map(({ user: { id } }) => id));
    }, [rusers]);

    async function loadTopic() {
        return client
            .fetchRoleUsers({ role_id: role.id })
            .then((data) => setRUsers(data))
            .catch(() => {});
    }

    function lockUser(id: string) {
        setLoading((loading) =>
            loading.includes(id) ? loading : loading.concat([id])
        );
    }

    function unlockUser(id: string) {
        setLoading((loading) => loading.filter((uid) => uid !== id));
    }

    function handleOpenUser(user: io.User) {
        return () => {
            navigator.openUser(user);
        };
    }

    function handleRemoveUser(user: io.User) {
        return () => {
            if (loading.includes(user.id) || !excludes.includes(user.id))
                return;
            client
                .removeRoleUser({
                    role_id: role.id,
                    user_id: user.id,
                })
                .then(() => {
                    setRUsers((members) =>
                        members.filter((m) => m.user.id !== user.id)
                    );
                })
                .finally(() => {
                    unlockUser(user.id);
                });
            lockUser(user.id);
        };
    }

    function handleAddUser(uid: string) {
        if (loading.includes(uid) || excludes.includes(uid)) return;
        client
            .addRoleUser({
                role_id: role.id,
                user_id: uid,
            })
            .then((data) => {
                setRUsers((users) => users.concat([data]));
            })
            .finally(() => {
                unlockUser(uid);
            });

        lockUser(uid);
    }

    function renderUser(ruser: io.RoleUser) {
        const { user } = ruser;
        return (
            <div
                key={user.id}
                className="flex justify-between text-gray-500 flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="flex flex-row flex-1 justify-between items-center">
                    <div
                        className="flex flex-row items-center"
                        onClick={handleOpenUser(user)}>
                        <img
                            alt={user.name}
                            src={user.avatar}
                            className="inline-block h-8 w-8 rounded-full"
                        />
                        <span className="px-4 text-gray-800 font-semibold text-base">
                            @{user.username}
                        </span>
                    </div>
                    <div className="px-4">
                        <span className="font-semibold text-sm">
                            {moment(ruser.created_at).format("ll")}
                        </span>
                    </div>
                </div>

                {!Boolean(role.is_default) && (
                    <div className="flex flex-row justify-end px-4 w-40 items-center">
                        {!loading.includes(user.id) && (
                            <Button
                                variant="icon"
                                color="clear"
                                onClick={handleRemoveUser(user)}
                                className="px-2">
                                <Icons.Delete />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col shadow rounded-md bg-white overflow-hidden">
            <UsersDialog
                onSelect={handleAddUser}
                selected={excludes}
                open={dialog.users}
                onClose={dialog.close}
            />
            <div className="py-2 bg-gray-100 flex flex-row justify-between">
                <div className="flex flex-row flex-1 justify-between items-center px-4">
                    <span className="font-bold px-4 text-gray-800">User</span>
                    <span className="font-semibold text-sm px-4 text-gray-600">
                        JOINED
                    </span>
                </div>
                {!Boolean(role.is_default) && (
                    <div className="flex flex-row w-40 justify-end px-4">
                        <Button
                            color="primary"
                            onClick={dialog.opener("users")}>
                            Add User
                        </Button>
                    </div>
                )}
            </div>
            <div className="divide-y divide-slate-200">
                {rusers.map(renderUser)}
            </div>
        </div>
    );
}
