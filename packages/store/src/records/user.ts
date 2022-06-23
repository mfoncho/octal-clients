import { Record, fromJS } from "immutable";
import { Unique, Id } from "@octal/client";
import { io } from "@octal/client";

export class Presence extends Record({
    state: "offline" as io.PresenceState,
    timestamp: "0",
}) {}

export class UserStatusRecord extends Record({
    icon: "",
}) {}

export class UserRecord
    extends Record(
        {
            id: "0" as Id,
            name: "",
            username: "",
            email: "",
            verified: false,
            avatar: null as any as string,
            bio: "",
            status: "",
            timeout: 0,
        },
        "user"
    )
    implements Unique
{
    patch(payload: any) {
        return this.merge(UserRecord.objectFromJS(payload));
    }

    static mapFromJS(data: any) {
        return fromJS(UserRecord.objectFromJS(data));
    }

    static objectFromJS(payload: any) {
        let data = { ...payload };
        if (data && data.state) {
            data.state = new UserStatusRecord(data.state);
        }
        return data;
    }

    static make(payload: any) {
        return new UserRecord(UserRecord.objectFromJS(payload));
    }
}
