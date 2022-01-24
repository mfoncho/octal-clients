import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Dialog, Avatar } from "@octal/ui";
import client, { io } from "@octal/client";
import * as Icons from "@octal/icons";

interface IUsersDialog {
    onSelect?: (id: string) => void;
    loading?: string[];
    excludes?: string[];
}

export default Dialog.create<IUsersDialog>(
    ({ excludes = [], loading = [], ...props }) => {
        const [users, setUsers] = useState<io.User[]>([]);

        useEffect(() => {
            client.fetchUsers().then((data) => setUsers(data));
        }, []);

        let availableUsers: JSX.Element[] = [];

        let unavailableUsers: JSX.Element[] = [];

        function renderUser(user: io.User, available: boolean) {
            const icon = (
                <div className="group-hover:text-white px-2 text-primary-500">
                    <Icons.Check className="w-6 h-6 " />
                </div>
            );

            const addable = available && !loading.includes(user.id);

            const onClick =
                addable && props.onSelect
                    ? () => props.onSelect!(user.id)
                    : undefined;

            return (
                <div
                    key={user.id}
                    role="button"
                    onClick={onClick}
                    className={clx(
                        "group flex flex-row my-1 p-1 rounded-md justify-between items-center",
                        Boolean(onClick)
                            ? "hover:bg-primary-500 "
                            : "hover:bg-gray-200"
                    )}>
                    <div className="flex flex-row">
                        <Avatar alt={user.name} src={user.avatar} />
                        <div className="flex flex-col px-2">
                            <span className="font-bold group-hover:text-white text-gray-800 text-sm">
                                {user.name}
                            </span>
                            <span className="group-hover:text-white font-semibold text-sm text-gray-500">
                                {user.username}
                            </span>
                        </div>
                    </div>
                    {!available && icon}
                </div>
            );
        }

        for (let user of users) {
            const available = !excludes.includes(user.id);
            const element = renderUser(user, available);
            if (available) {
                availableUsers.push(element);
            } else {
                unavailableUsers.push(element);
            }
        }

        return (
            <Dialog
                open={props.open}
                title="Users"
                maxWidth="xs"
                fullHeight={true}
                onClose={props.onClose}>
                <Dialog.Content className="flex flex-col overflow-hiddden">
                    <div className="relative flex flex-col item-center">
                        <input className="form-input font-semibold rounded-md text-sm text-gray-800 pl-10 pr-4 border shadow-sm border-gray-300" />
                        <div className="absolute px-2 h-full flex flex-col justify-center">
                            <Icons.Search className="text-gray-500 w-5 h-5" />
                        </div>
                    </div>
                    <div className="users flex flex-col py-4 overflow-x-hiddden overflow-y-auto">
                        {availableUsers.length > 0 && (
                            <div className="flex flex-col">
                                <span className="px-4 py-1 text-xs font-bold bg-gray-100 text-gray-800">
                                    AVAILABLE
                                </span>
                                <div className="flex flex-col">
                                    {availableUsers}
                                </div>
                            </div>
                        )}
                        <div className="flex pt-8 flex-col">
                            <span className="px-4 py-1 text-xs font-bold bg-gray-100 text-gray-800">
                                MEMBERS
                            </span>
                            <div className="flex flex-col">
                                {unavailableUsers}
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog>
        );
    }
);
