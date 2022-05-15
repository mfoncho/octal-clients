import React, { useEffect, useState } from "react";
import { Map } from "immutable";
import clx from "classnames";
import * as Icons from "@octal/icons";
import { Button, Text } from "@octal/ui";
import { RoleRecord, SpaceRoleRecord } from "@octal/store";
import { useSpace } from "@octal/store";
import { useActions } from "@workspace/Space";
import BooleanPermission from "./BooleanPermission";
import definitions, { IPermissionsGroup, IPermission } from "./permissions";
import NumberPermission from "./NumberPermission";
import StringPermission from "./StringPermission";

interface IRole {
    role: RoleRecord;
    selected: SpaceRoleRecord;
    onClose: (e: React.MouseEvent) => void;
}

export default function Role(props: IRole) {
    const space = useSpace(props.selected.space_id);
    const actions = useActions(space);
    const [loading, setLoading] = useState<boolean>(false);

    const [changes, setChanges] = useState<Map<string, any>>(
        Map<string, any>()
    );

    const [overrides, setOverrides] = useState<Map<string, any>>(
        Map<string, any>()
    );

    const hasChanges = !changes.equals(overrides);

    useEffect(() => {
        const custom = props.selected.permissions.reduce(
            (acc: any, perm: any) => {
                return acc.set(perm.name, perm.value);
            },
            Map()
        );
        setChanges(custom);
        setOverrides(custom);
    }, [props.selected]);

    function handleSetPermission(key: string, value: any) {
        const permission = props.selected.permissions.find(
            (permission) => permission.name == key
        );
        if (permission) {
            if (permission.value == value) {
                setChanges((changes) => {
                    return changes.delete(key);
                });
            } else {
                setChanges((changes) => {
                    return changes.set(key, value);
                });
            }
            return;
        } else {
            setChanges((changes) => {
                return changes.set(key, value);
            });
            return;
        }
    }

    function handleClearPermission(key: string) {
        setChanges((changes) => changes.delete(key));
    }

    function handleSaveChanges(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        actions
            .setPermissions(props.role.id, changes.toJS() as any)
            .then(() => {
                setOverrides(changes);
            })
            .finally(() => setLoading(false));
        setLoading(true);
    }

    function renderPermission(permission: IPermission) {
        const { key } = permission;
        if (permission.type === "boolean") {
            return (
                <BooleanPermission
                    key={permission.key}
                    enabled={changes.has(key)}
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
                    key={permission.key}
                    enabled={changes.has(key)}
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
                    key={permission.key}
                    enabled={changes.has(key)}
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
                <div
                    className={clx(
                        "sticky top-0 flex flex-row items-center bg-white justify-between",
                        hasChanges ? "visible" : "invisible"
                    )}>
                    <span className="font-semibold text-sm text-gray-500 px-2">
                        You have made some changes
                    </span>
                    <Button
                        color="primary"
                        disabled={loading}
                        onClick={handleSaveChanges}>
                        Save
                    </Button>
                </div>
            </div>
            {definitions.map(renderPermissionGroup)}
        </div>
    );
}
