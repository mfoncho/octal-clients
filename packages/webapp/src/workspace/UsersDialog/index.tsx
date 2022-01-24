import React, { useState, useEffect } from "react";
import { Dialog, Avatar } from "@octal/ui";
import client, { io } from "@octal/client";
import * as Icons from "@octal/icons";

interface IUsersDialog {
    onSelect?: (id: string) => void;
    selected?: string[];
}

export default Dialog.create<IUsersDialog>(({ selected = [], ...props }) => {
    const [users, setUsers] = useState<io.User[]>([]);
    useEffect(() => {
        client.fetchUsers().then((data) => setUsers(data));
    }, []);

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
                    {users.map((user) => (
                        <div
                            key={user.id}
                            role="button"
                            onClick={
                                props.onSelect &&
                                (() => props.onSelect!(user.id))
                            }
                            className="group flex flex-row my-1 p-1 rounded-md hover:bg-primary-500 justify-between items-center">
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
                            {selected.includes(user.id) && (
                                <div className="group-hover:text-white px-2 text-primary-500">
                                    <Icons.Check className="w-6 h-6 " />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Dialog.Content>
        </Dialog>
    );
});
