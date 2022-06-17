import React, { useEffect, useState } from "react";
import { io } from "@console/types";
import client from "@console/client";
import {
    Permissions,
    PermissionGroups,
    IPermissionsGroup,
    IPermission,
} from "@octal/store";
import NumberPermission from "./NumberPermission";
import StringPermission from "./StringPermission";
import BooleanPermission from "./BooleanPermission";

interface IRole {
    role: io.Role;
}

const defaultPermissions = new Permissions();

export default function Role(props: IRole) {
    const { role } = props;
    const [permissions, setPermissions] = useState(defaultPermissions);

    useEffect(() => {
        if (role) {
            fetchPermissions();
        }
    }, [Boolean(role)]);

    function fetchPermissions() {
        client.fetchRolePermissions({ role_id: role.id }).then((data) => {
            let loadedPermissions = data.reduce(
                (permissions: any, permission: any) => {
                    let record = permissions.get(permission.permission);
                    if (record) {
                        return permissions.set(
                            permission.permission,
                            record.merge(permission)
                        );
                    }
                    return permissions;
                },
                permissions
            );
            setPermissions(loadedPermissions);
        });
    }

    function handleSetPermission(key: string, value: any) {
        let permission = permissions.get(key as any);
        setPermissions((permissions) => {
            let permission = permissions.get(key as any);
            if (permission) {
                return permissions.set(
                    //@ts-ignore
                    key,
                    permission.set("value", value)
                );
            }
            return permissions;
        });
        if (permission) {
            const params = {
                value: value,
                overwrite: permission.overwrite,
            };
            client.setRolePermissions({
                params,
                role_id: role.id,
                permission: key,
            });
        }
    }

    function handleToggleOverwrite(key: string) {
        let permission = permissions.get(key as any);
        setPermissions((permissions) => {
            let permission = permissions.get(key as any);
            if (permission) {
                return permissions.set(
                    //@ts-ignore
                    key,
                    permission.set("overwrite", !permission.overwrite)
                );
            }
            return permissions;
        });
        if (permission) {
            const params = {
                value: permission.value,
                overwrite: !permission.overwrite,
            };
            client.setRolePermissions({
                params,
                role_id: role.id,
                permission: key,
            });
        }
    }

    function renderPermission(permission: IPermission) {
        const key = permission.permission;
        const perm = permissions.get(key);
        const value = perm.value as any;
        const overwrite = perm.overwrite;
        if (permission.type === "boolean") {
            return (
                <BooleanPermission
                    key={key}
                    value={value}
                    overwrite={overwrite}
                    onOverwrite={handleToggleOverwrite}
                    onChange={handleSetPermission}
                    permission={permission}
                />
            );
        }
        if (permission.type === "number") {
            return (
                <NumberPermission
                    min={0}
                    max={1024}
                    key={key}
                    value={value}
                    overwrite={overwrite}
                    onOverwrite={handleToggleOverwrite}
                    onChange={handleSetPermission}
                    permission={permission}
                />
            );
        }
        if (permission.type == "string") {
            return (
                <StringPermission
                    key={key}
                    value={value}
                    overwrite={overwrite}
                    onOverwrite={handleToggleOverwrite}
                    onChange={handleSetPermission}
                    permission={permission}
                />
            );
        }
        return null;
    }

    function renderPermissionGroup(group: IPermissionsGroup) {
        return (
            <div key={group.key} className="flex flex-col my-2 ">
                <span className="font-bold text-gray-600">{group.name}</span>
                <div className="group flex flex-col divide-y-1 divide-cool-gray-100 divide-solid py-4 border-2 border-gray-200 rounded-lg">
                    {group.permissions.map(renderPermission)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-2">
            {PermissionGroups.map(renderPermissionGroup)}
        </div>
    );
}
