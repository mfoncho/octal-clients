import { Record, List } from "immutable";
import { Unique } from "@octal/client";

export interface BasePermission<T = any> {
    readonly value: T;
    readonly overwrite: boolean;
}

export class BooleanPermission
    extends Record({
        value: true,
        overwrite: false,
    })
    implements BasePermission<boolean> {}

export class NumberPermission
    extends Record({
        value: 0,
        overwrite: false,
    })
    implements BasePermission<number> {}

export class ListPermission extends Record({
    value: [] as any[],
    overwrite: false,
}) {}

export class StringPermission
    extends Record({
        value: "",
        overwrite: false,
    })
    implements BasePermission<string> {}

const booleanPermission = new BooleanPermission();

const numberPermission = new NumberPermission();

//const listPermission = new ListPermission();

const stringPermission = new StringPermission();

export const permissions = {
    ["message.attachment.max"]: numberPermission,
    ["message.attachment.types"]: stringPermission,
    ["message.embeds"]: booleanPermission,
    ["message.pin"]: booleanPermission,
    ["message.edit"]: booleanPermission,
    ["card.create"]: booleanPermission,
    ["card.move"]: booleanPermission,
    ["card.delete"]: booleanPermission,
    ["board.manage"]: booleanPermission,
    ["space.manage"]: booleanPermission,
    ["message.manage"]: booleanPermission,
    ["message.create"]: booleanPermission,
    ["space.leave"]: booleanPermission,
    ["message.delete"]: booleanPermission,
    ["invitation.send"]: booleanPermission,
};

export type BasePermissionScheme = typeof permissions;

export type Permission = keyof BasePermissionScheme;

export class Permissions extends Record(permissions) {}

export class RoleRecord
    extends Record({
        id: "",
        name: "",
        permissions: new Permissions(),
    })
    implements Unique
{
    constructor(payload: any) {
        super(RoleRecord.fromJS(payload));
    }
    static make(payload: any) {
        return new RoleRecord(payload);
    }

    static fromJS(payload: any) {
        if (Array.isArray(payload.permissions)) {
            const permissions = payload.permissions.reduce(
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
                new Permissions()
            );
            payload = { ...payload, permissions };
        }
        return payload;
    }
}

export class AuthRecord
    extends Record(
        {
            id: "",
            token: "",
            roles: List<string>(),
        },
        "auth"
    )
    implements Unique
{
    constructor(payload: any) {
        super(AuthRecord.fromJS(payload));
    }

    static make(payload: any) {
        return new AuthRecord(payload);
    }

    static fromJS(payload: any) {
        if (Array.isArray(payload.roles)) {
            const roles = payload.roles.map((role: any) => {
                if (typeof role === "string") {
                    return role;
                }
                return role.id;
            });
            payload = { ...payload, roles: List(roles) };
        }
        return payload;
    }
}
