import { Record, List, Map } from "immutable";
import { IPermission } from "./auth";
import { Unique, Id, SpaceType, AccessType } from "@octal/client";

export class SpaceRoleRecord
    extends Record({
        id: "" as Id,
        role_id: "" as Id,
        space_id: "" as Id,
        permissions: [] as IPermission[],
    })
    implements Unique
{
    static make(payload: any) {
        if (Record.isRecord(payload)) return payload as any as SpaceRoleRecord;
        return new SpaceRoleRecord(payload);
    }
}

export class SpaceRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        users: List<Id>(),
        type: "" as SpaceType,
        access: "" as AccessType,
        topic_id: "",
        thread_id: "",
        member_id: "" as Id,
        roles: Map<string, SpaceRoleRecord>(),
        joined_at: "",
        loaded: List<string>([]),
        created_at: "",
    })
    implements Unique
{
    constructor(data: any) {
        super(SpaceRecord.objectFromJS(data) as any);
    }

    addLoaded(collection: string) {
        return this.loaded.includes(collection)
            ? this
            : this.update("loaded", (loaded) => loaded.push(collection));
    }

    get is_private() {
        return this.access == "private";
    }

    get is_public() {
        return this.access == "public";
    }

    get is_board() {
        return this.type === "board";
    }

    get is_direct() {
        return this.type === "direct";
    }

    get is_archived() {
        return false;
    }

    get is_discuss() {
        return this.type === "discuss";
    }

    toServer() {
        return this.toJS();
    }

    patch(data: any) {
        return this.merge(SpaceRecord.objectFromJS(data));
    }

    putRole(payload: any) {
        return this.update("roles", (roles) => {
            return roles.set(payload.role_id, SpaceRoleRecord.make(payload));
        });
    }

    patchRole(payload: any) {
        return this.update("roles", (roles) => {
            return roles.map((role) => {
                if (role.id !== payload.id) return role;
                return new SpaceRoleRecord(payload);
            });
        });
    }

    removeRole(id: string) {
        return this.update("roles", (roles) =>
            roles.filter((role) => role.id !== id)
        );
    }

    static mapFromJS(data: any) {
        return SpaceRecord.objectFromJS(data);
    }

    static objectFromJS(data: any) {
        if (data.roles) {
            const roles = data.roles.reduce((roles: any, role: any) => {
                return roles.set(role.role_id, new SpaceRoleRecord(role));
            }, Map());
            data = { ...data, roles };
        }
        if (data.users) {
            const users = List(data.users);
            data = { ...data, users };
        }
        return data;
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) return payload as any as SpaceRecord;
        return new SpaceRecord(payload);
    }
}
