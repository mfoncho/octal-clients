import React from "react";
import * as Icons from "@colab/icons";
import { Text } from "@colab/ui";
import { RoleRecord, SpaceRoleRecord } from "@colab/store";
import { useRoleActions } from "@workspace/Space";
import BooleanPermission from "./BooleanPermission";
import { PermissionGroups, IPermissionsGroup, IPermission } from "@colab/store";
import NumberPermission from "./NumberPermission";
import StringPermission from "./StringPermission";

interface IRole {
    role: RoleRecord;
    selected: SpaceRoleRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function Role(props: IRole) {
    const role = props.selected;
    const actions = useRoleActions(props.selected);

    function handleDeletePermission(key: string) {
        actions.unsetPermission(key);
    }

    function handleSetPermission(key: string, value: any) {
        actions.setPermission(key, value);
    }

    function renderPermission(permission: IPermission) {
        const value = role.permissions.get(permission.permission);
        const enabled = value !== undefined && value !== null;
        if (permission.type === "boolean") {
            return (
                <BooleanPermission
                    key={permission.permission}
                    enabled={enabled}
                    onClear={handleDeletePermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={value as any}
                />
            );
        }
        if (permission.type === "number") {
            return (
                <NumberPermission
                    min={0}
                    max={1024}
                    key={permission.permission}
                    enabled={enabled}
                    onClear={handleDeletePermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={value as any}
                />
            );
        }
        if (permission.type == "string") {
            return (
                <StringPermission
                    key={permission.permission}
                    enabled={enabled}
                    onClear={handleDeletePermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={value as any}
                />
            );
        }
        return null;
    }

    function renderPermissionGroup(group: IPermissionsGroup) {
        if (group.key === "system") return null;
        return (
            <div key={group.key} className="flex flex-col my-2 ">
                <span className="font-bold text-gray-600">{group.name}</span>
                <div className="group flex flex-col divide-y-1 divide-gray-100 divide-solid py-4 border-2 border-gray-200 rounded-lg">
                    {group.permissions.map(renderPermission)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-2">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="flex flex-row items-center">
                    <button
                        onClick={props.onClose}
                        className="text-gray-500 rounded-full border border-gray-500 p-1 hover:bg-gray-200 flex items-center justify-center">
                        <Icons.LeftArrow className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-gray-700 mx-2">
                        <Text>{props.role.name}</Text>
                    </span>
                </div>
            </div>
            {PermissionGroups.map(renderPermissionGroup)}
        </div>
    );
}
