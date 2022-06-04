import React, { useEffect, useState } from "react";
import { Map } from "immutable";
import { Button } from "@octal/ui";
import definitions, { IPermissionsGroup, IPermission } from "./permissions";
import { permissions } from "@octal/store";
import NumberPermission from "./NumberPermission";
import StringPermission from "./StringPermission";
import BooleanPermission from "./BooleanPermission";
import { io } from "@console/types";
import client from "@console/client";

interface IRole {
    role: io.Role;
}

type PermissionKey = keyof typeof permissions;

export default function Role(props: IRole) {
    const { role } = props;
    const [permissions, setPermissions] = useState<io.Permission[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [changes, setChanges] = useState<Map<string, any>>(
        Map<string, any>()
    );

    const [overrides, setOverrides] = useState<Map<string, any>>(
        Map<string, any>()
    );

    const hasChanges = !changes.equals(overrides);

    useEffect(() => {
        if (props.role) {
            fetchPermissions();
        }
    }, [Boolean(role)]);

    useEffect(() => {
        const custom = permissions.reduce((acc: any, perm: any) => {
            return acc.set(perm.name, perm.value);
        }, Map());
        setChanges(custom);
        setOverrides(custom);
    }, [permissions]);

    function fetchPermissions() {
        client.fetchRolePermissions({ role_id: role.id }).then((data) => {
            setPermissions(data);
        });
    }

    function handleSetPermission(key: string, value: any) {
        setChanges((changes) => {
            return changes.set(key, value);
        });
    }

    function handleClearPermission(key: string) {
        setChanges((changes) => changes.delete(key));
    }

    function handleSaveChanges(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        client
            .setRolePermissions({
                role_id: role.id,
                permissions: changes.toJS(),
            })
            .then((data) => setPermissions(data))
            .catch(() => {})
            .finally(() => setLoading(false));
        setLoading(true);
    }

    function renderPermission(permission: IPermission) {
        const key = permission.permission;
        const enabled = true;
        if (permission.type === "boolean") {
            return (
                <BooleanPermission
                    key={key}
                    enabled={enabled}
                    onClear={handleClearPermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={changes.get(key, false)}
                />
            );
        }
        if (permission.type === "number") {
            return (
                <NumberPermission
                    min={0}
                    max={1024}
                    key={key}
                    enabled={enabled}
                    onClear={handleClearPermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={changes.get(key, 0)}
                />
            );
        }
        if (permission.type == "string") {
            return (
                <StringPermission
                    key={key}
                    enabled={enabled}
                    onClear={handleClearPermission}
                    onChange={handleSetPermission}
                    permission={permission}
                    value={changes.get(key, "")}
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
            {definitions.map(renderPermissionGroup)}
            {hasChanges && (
                <div
                    className="fixed flex bottom-4 flex-row items-center p-4 bg-white justify-between"
                    style={{ width: "550px" }}>
                    <span className="font-semibold text-sm text-gray-500">
                        You have made some changes
                    </span>
                    <Button
                        disabled={loading}
                        color="primary"
                        onClick={handleSaveChanges}>
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}
