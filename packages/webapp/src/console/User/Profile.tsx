import React from "react";
import { io } from "@console/types";
import { Text } from "@octal/ui";

export default React.memo<{ user: io.Account }>(({ user }) => {
    return (
        <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
                <img
                    className="w-24 h-24 rounded-lg"
                    alt={user.name}
                    src={user.avatar}
                />
            </div>

            <div className="flex flex-col bg-white  rounded-md shadow flex-1 divide-y divide-slate-100">
                <div className="flex items-center flex-row px-4">
                    <span className="font-bold text-gray-800">
                        <Text>{user.name}</Text>
                    </span>
                </div>
                <div className="flex items-center flex-row px-4">
                    <span className="text-sm font-medium text-gray-600 text-primary-500">
                        <Text>{`@${user.username}`}</Text>
                    </span>
                </div>
                <div className="flex items-center flex-row px-4">
                    <span className="font-medium">
                        <Text>{user.email}</Text>
                    </span>
                </div>
                <div className="flex items-center flex-row px-4">
                    <span className="text-gray-800">
                        <Text>{user.status}</Text>
                    </span>
                </div>
            </div>
        </div>
    );
});
