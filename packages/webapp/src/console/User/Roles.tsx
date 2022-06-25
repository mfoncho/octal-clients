import React from "react";
import { io } from "@console/types";
import { Text } from "@octal/ui";
import * as Icons from "@octal/icons";

export default React.memo<{ roles: io.Role[] }>((props) => {
    function renderRole(role: io.Role) {
        return (
            <div
                key={role.id}
                className="flex flex-row px-4 py-2 items-center hover:bg-primary-50">
                <div className="w-10 h-10 flex justify-center items-center text-white bg-primary-500 rounded-lg">
                    <Icons.Role />
                </div>
                <span className="px-4 font-semibold text-base">
                    <Text>{role.name}</Text>
                </span>
            </div>
        );
    }
    return (
        <div className="flex flex-col rounded-md bg-white shadow overflow-hidden">
            <div className="py-4 bg-gray-100">
                <span className="font-bold py-4 px-4 text-gray-800">Roles</span>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
                {props.roles.map(renderRole)}
            </div>
        </div>
    );
});
