import React from "react";
import { io } from "@console/types";
import { Label } from "@octal/ui";
import * as Icons from "@octal/icons";
import { Dialog, Button } from "@octal/ui";
import { useNavigator } from "@console/hooks";
import moment from "moment";
import client from "@console/client";
import UsersDialog from "./UsersDialog";

export interface IMembers {
    space: io.Space;
    updateSpace: (space: io.Space) => void;
}

export default function Members({ space, updateSpace }: IMembers) {
    const navigator = useNavigator();

    const dialog = Dialog.useDialog();

    const [loading, setLoading] = React.useState<string[]>([]);
    const [excludes, setExcludes] = React.useState<string[]>([]);

    const [members, setMembers] = React.useState<io.Member[]>([]);

    React.useEffect(() => {
        if (space) {
            loadTopic();
        }
    }, [space.id]);

    React.useEffect(() => {
        setExcludes(() => members.map(({ user: { id } }) => id));
    }, [members]);

    async function loadTopic() {
        return client
            .fetchSpaceMembers({ space_id: space.id })
            .then((data) => setMembers(data))
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

    function handleRemoveMember(member: io.Member) {
        return () => {
            client
                .removeSpaceMember({
                    space_id: member.space_id,
                    member_id: member.id,
                })
                .then(() => {
                    setMembers((members) =>
                        members.filter((m) => m.user.id !== member.user.id)
                    );
                })
                .finally(() => {
                    unlockUser(member.user.id);
                });
            lockUser(member.user.id);
        };
    }

    function handleCrownMember(member: io.Member) {
        return () => {
            client
                .electSpaceUser({
                    space_id: member.space_id,
                    user_id: member.user.id,
                })
                .then((data) => {
                    updateSpace({ ...space, ...data });
                })
                .finally(() => {
                    unlockUser(member.user.id);
                });

            lockUser(member.user.id);
        };
    }

    function handleAddUser(uid: string) {
        client
            .addSpaceUser({
                space_id: space.id,
                user_id: uid,
            })
            .then((data) => {
                setMembers((members) => members.concat([data]));
            })
            .finally(() => {
                unlockUser(uid);
            });

        lockUser(uid);
    }

    function renderMember(member: io.Member) {
        const { user } = member;
        return (
            <div
                key={member.id}
                className="flex justify-between text-gray-500 flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="flex flex-row flex-1 justify-between items-center">
                    <div
                        role="button"
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
                            {moment(member.joined_at).format("ll")}
                        </span>
                    </div>
                </div>
                <div className="flex flex-row justify-end px-4 w-40 items-center space-x-2">
                    {user.id === space.admin.id ? (
                        <Label color="red">ADMIN</Label>
                    ) : (
                        !loading.includes(user.id) && (
                            <>
                                <Button
                                    variant="icon"
                                    color="clear"
                                    onClick={handleCrownMember(member)}
                                    className="px-2">
                                    <Icons.Crown />
                                </Button>
                                <Button
                                    variant="icon"
                                    color="clear"
                                    onClick={handleRemoveMember(member)}
                                    className="px-2">
                                    <Icons.Delete />
                                </Button>
                            </>
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-md overflow-hidden bg-white shadow">
            <UsersDialog
                loading={loading}
                onSelect={handleAddUser}
                excludes={excludes}
                open={dialog.users}
                onClose={dialog.close}
            />
            <div className="py-2 bg-gray-100 flex flex-row justify-between">
                <div className="flex flex-row flex-1 justify-between items-center px-4">
                    <span className="font-bold px-4 text-gray-800">Users</span>
                    <span className="font-semibold text-sm px-4 text-gray-600">
                        JOINED
                    </span>
                </div>
                <div className="flex flex-row w-40 justify-end px-4">
                    <Button color="primary" onClick={dialog.opener("users")}>
                        Add User
                    </Button>
                </div>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
                {members.map(renderMember)}
            </div>
        </div>
    );
}
