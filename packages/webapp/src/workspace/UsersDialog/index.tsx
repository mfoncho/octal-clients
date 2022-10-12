import React, { useState, useEffect } from "react";
import { Dialog, Avatar } from "@colab/ui";
import client from "@colab/client";
import { Scrollbars } from "react-custom-scrollbars";
import { useInput } from "src/utils";
import * as Icons from "@colab/icons";

interface User {
    id: string;
    name: string;
    avatar: string;
    username: string;
}

interface ArrayLike<T = any> {
    map<S>(mapper: (val: T, index: number) => S): ArrayLike<S>;
}

interface IUsersDialog {
    onSelect?: (id: string) => void;
    selected?: string[];
    users?: ArrayLike<User>;
}

export default Dialog.create<IUsersDialog>(({ selected = [], ...props }) => {
    const [users, setUsers] = useState<User[]>([]);

    const search = useInput("");

    useEffect(() => {
        if (props.users) {
            setUsers(props.users as User[]);
        } else {
            client.fetchUsers().then((data) => setUsers(data));
        }
    }, []);

    return (
        <Dialog
            open={props.open}
            title="Users"
            maxWidth="xs"
            fullHeight={true}
            onClose={props.onClose}>
            <Dialog.Content className="flex-1 flex flex-col overflow-hidden">
                <div className="relative flex flex-col item-center">
                    <input
                        {...search.props}
                        className="form-input font-semibold rounded-md text-sm text-gray-800 pl-10 pr-4 border shadow-sm border-gray-300"
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Filter className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
                <div className="flex-grow flex-col py-4 overflow-hidden">
                    <Scrollbars style={{ width: "100%", height: "100%" }}>
                        {(search.valid
                            ? users.filter(
                                  (user) =>
                                      user.name.includes(search.value) ||
                                      user.username.includes(search.value)
                              )
                            : users
                        ).map((user) => (
                            <div
                                key={user.id}
                                role="button"
                                onClick={
                                    props.onSelect &&
                                    (() => props.onSelect!(user.id))
                                }
                                className="group flex flex-row my-1 p-1 rounded-md hover:bg-primary-500 justify-between items-center">
                                <div className="flex flex-row">
                                    <Avatar
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <div className="flex flex-col px-2">
                                        <span className="font-bold group-hover:text-white text-gray-800 text-base">
                                            {user.username}
                                        </span>
                                        <span className="group-hover:text-white font-semibold text-xs text-gray-500">
                                            {user.name}
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
                    </Scrollbars>
                </div>
            </Dialog.Content>
        </Dialog>
    );
});
