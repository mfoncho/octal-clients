import type { Channel } from "@colab/endpoint";
import { Record, List, Map } from "immutable";
import { Permission } from "./permissions";
import { Unique, Id, SpaceType } from "@colab/client";

export const SpacePermissions = Map<Permission, string | number | boolean>();

export type SpacePermissions = typeof SpacePermissions;

export class LabelRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        color: "",
        space_id: "" as Id,
    })
    implements Unique
{
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as LabelRecord;
        }
        return new LabelRecord(payload);
    }
}

export class SpaceRoleRecord extends Record({
    role_id: "" as Id,
    space_id: "" as Id,
    created_at: "",
    permissions: SpacePermissions,
}) {
    constructor(payload?: any) {
        super(payload ? SpaceRoleRecord.fromJS(payload) : payload);
    }

    setPermission(name: string, value: string | number | boolean) {
        return this.setIn(["permissions", name], value);
    }

    unsetPermission(name: string) {
        return this.deleteIn(["permissions", name]);
    }

    static make(payload: any) {
        return new SpaceRoleRecord(payload);
    }

    static fromJS(payload: any) {
        if (Record.isRecord(payload)) return payload as any as SpaceRoleRecord;
        if (Array.isArray(payload.permissions)) {
            let permissions = payload.permissions.reduce(
                (acc: any, permission: any) =>
                    acc.set(permission.name, permission.value),
                SpacePermissions
            );
            payload = { ...payload, permissions };
        }
        return payload;
    }
}

export class SpaceRecord
    extends Record({
        id: "" as Id,
        name: "",
        purpose: "",
        admin_id: "",
        users: List<Id>(),
        type: "" as SpaceType,
        topic_id: "",
        thread_id: "",
        member_id: "" as Id,
        channel: null as null | Channel,
        roles: Map<string, SpaceRoleRecord>(),
        labels: List<LabelRecord>(),
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

    get is_common() {
        return this.type === "common";
    }

    get is_private() {
        return this.type === "private";
    }

    get is_public() {
        return this.type === "public";
    }

    get is_direct() {
        return this.type === "direct";
    }

    patch(data: any) {
        return this.merge(SpaceRecord.objectFromJS(data));
    }

    putRole(payload: any) {
        return this.update("roles", (roles) => {
            return roles.set(payload.role_id, SpaceRoleRecord.make(payload));
        });
    }

    setPermission(role_id: string, name: string, value: any) {
        const role = this.roles.get(role_id);
        if (role) {
            return this.setIn(
                ["roles", role_id],
                role.setPermission(name, value)
            );
        }
        return this;
    }

    unsetPermission(role_id: string, name: string) {
        const role = this.roles.get(role_id);
        if (role) {
            return this.setIn(
                ["roles", role.role_id],
                role.unsetPermission(name)
            );
        }
        return this;
    }

    deleteRole(role_id: string) {
        return this.deleteIn(["roles", role_id]);
    }

    setChannel(channel: Channel) {
        return this.set("channel", channel);
    }

    putLabel(payload: any) {
        const index = this.labels.findIndex((label) => payload.id === label.id);
        if (index === -1) {
            return this.update("labels", (labels) =>
                labels.push(LabelRecord.make(payload))
            );
        }
        return this.updateIn(["labels", index], (label: any) =>
            label.merge(payload)
        );
    }

    patchLabel(payload: any) {
        const index = this.labels.findIndex((label) => payload.id === label.id);
        if (index === -1) return this;

        return this.updateIn(["labels", index], (label: any) =>
            label.merge(payload)
        );
    }

    removeLabel(id: string) {
        const index = this.labels.findIndex((label) => id === label.id);
        if (index === -1) return this;
        return this.update("labels", (labels) =>
            labels.filter((label) => label.id !== id)
        );
    }
    toServer() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            purpose: this.purpose,
            admin_id: this.admin_id,
            topic_id: this.topic_id,
            thread_id: this.thread_id,
            joined_at: this.joined_at,
            created_at: this.created_at,
        };
    }

    static mapFromJS(data: any) {
        return SpaceRecord.objectFromJS(data);
    }

    static objectFromJS(data: any) {
        if (data.roles) {
            const roles = data.roles.reduce((roles: any, role: any) => {
                return roles.set(role.role_id, SpaceRoleRecord.make(role));
            }, Map());
            data = { ...data, roles };
        }
        if (data.users) {
            const users = List(data.users);
            data = { ...data, users };
        }
        if (Array.isArray(data.labels)) {
            let labels = List(
                data.labels.map((label: any) => new LabelRecord(label))
            );
            data = { ...data, labels };
        }
        return data;
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) return payload as any as SpaceRecord;
        return new SpaceRecord(payload);
    }
}
