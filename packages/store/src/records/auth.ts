import { Record, List } from "immutable";
import { Unique } from "@octal/client";
import { Permissions } from "./permissions";

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
