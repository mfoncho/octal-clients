import { Record, List } from "immutable";
import { Unique } from "@octal/client";

export interface BasePermission<T = any> {
    readonly value: T;
    readonly overwrite: boolean;
    readonly permission: string;
}

export class BooleanPermission
    extends Record({
        permission: "",
        value: false,
        overwrite: false,
    })
    implements BasePermission<boolean> {}

export class NumberPermission
    extends Record({
        value: 0,
        overwrite: false,
        permission: "",
    })
    implements BasePermission<number> {}

export class ListPermission extends Record({
    value: [] as any[],
    overwrite: false,
    permission: "",
}) {}

export class StringPermission
    extends Record({
        value: "",
        overwrite: false,
        permission: "",
    })
    implements BasePermission<string> {}

const booleanPermission = new BooleanPermission();

const numberPermission = new NumberPermission();

//const listPermission = new ListPermission();

const stringPermission = new StringPermission();

export const permissions = {
    ["space.manage"]: booleanPermission,
    ["space.leave"]: booleanPermission,
    ["card.create"]: booleanPermission,
    ["card.move"]: booleanPermission,
    ["card.delete"]: booleanPermission,
    ["board.manage"]: booleanPermission,
    ["message.attachment.max"]: numberPermission,
    ["message.attachment.types"]: stringPermission,
    ["message.embeds"]: booleanPermission,
    ["message.edit"]: booleanPermission,
    ["message.post"]: booleanPermission,
    ["thread.manage"]: booleanPermission,
    ["message.delete"]: booleanPermission,
    ["invite.mail.send"]: booleanPermission,
    ["invite.link.create"]: booleanPermission,
};

export type BasePermissionScheme = typeof permissions;

export type Permission = keyof BasePermissionScheme;

export class Permissions extends Record(permissions) {}

export class RoleRecord
    extends Record({
        id: "",
        icon: "",
        name: "",
        is_default: false,
        permissions: new Permissions(),
    })
    implements Unique
{
    constructor(payload: any) {
        super(RoleRecord.fromJS(payload));
    }

    setPermission(payload: any) {
        let permission = this.permissions.get(payload.permission);
        if (permission) {
            permission = permission.merge(payload);
            return this.setIn(
                ["permissions", permission.permission],
                permission
            );
        }
        return this;
    }

    patch(payload: any) {
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
                this.permissions
            );
            payload = { ...payload, permissions };
        }
        return this.merge(payload);
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
