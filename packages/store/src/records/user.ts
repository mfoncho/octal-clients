import { Record, fromJS, List } from "immutable";
import { Unique, Id } from "@colab/client";
import { io } from "@colab/client";

export class Presence extends Record({
    state: "offline" as io.PresenceState,
    timestamp: "0",
}) {}

export class UserStatusRecord extends Record({
    icon: "",
    text: "",
    timeout: 0,
}) {
    toString() {
        if (Boolean(this.icon)) {
            return `${this.icon} ${this.text}`;
        }
        return this.text;
    }
}

export class UserRecord
    extends Record(
        {
            id: "0" as Id,
            name: "",
            roles: List<string>([]),
            username: "",
            verified: false,
            avatar: null as any as string,
            bio: "",
            status: new UserStatusRecord(),
        },
        "user"
    )
    implements Unique
{
    patch(payload: any) {
        return this.merge(UserRecord.objectFromJS(payload));
    }

    setStatus(payload: any) {
        return this.set("status", new UserStatusRecord(payload));
    }

    addRole(role_id: string) {
        if (this.roles.includes(role_id)) return this;
        return this.set("roles", this.roles.push(role_id));
    }

    removeRole(role_id: string) {
        if (this.roles.includes(role_id))
            return this.set(
                "roles",
                this.roles.filter((rid) => rid !== role_id)
            );
        return this;
    }
    static mapFromJS(data: any) {
        return fromJS(UserRecord.objectFromJS(data));
    }

    static objectFromJS(payload: any) {
        let data = { ...payload };
        if (data && data.status) {
            data.status = new UserStatusRecord(data.status);
        }
        if (Array.isArray(data.roles)) {
            data.roles = List(data.roles);
        }
        return data;
    }

    static make(payload: any) {
        return new UserRecord(UserRecord.objectFromJS(payload));
    }
}
