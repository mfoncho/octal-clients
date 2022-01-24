import React from "react";
import { io } from "@console/types";
import { Text } from "@octal/ui";

export default React.memo<{ user: io.Account }>(({ user }) => {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col pr-8">
                <img
                    className="w-24 h-24 rounded-lg"
                    alt={user.name}
                    src={user.avatar}
                />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col">
                    <span className="font-bold text-2xl text-gray-800">
                        <Text>{user.name}</Text>
                    </span>
                    <span className="text-sm font-semibold text-gray-600 text-primary-500">
                        <Text>{`@${user.username}`}</Text>
                    </span>
                </div>
                <div>
                    <span className="font-bold">
                        <Text>{user.email}</Text>
                    </span>
                </div>
                <div>
                    <span className="text-gray-800">
                        <Text>{user.status}</Text>
                    </span>
                </div>
            </div>
        </div>
    );
});
