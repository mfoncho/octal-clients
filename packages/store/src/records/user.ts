import { Record, fromJS } from "immutable";
import { Unique, Id } from "@octal/client";
import { io } from "@octal/client";

export class PreferencesRecord extends Record<io.Preferences>({
    theme: "",
    locale: "",
    timezone: "",
    time_format: "12",
    theme_mode: "dark",
    message_type: "default",
    notifications: true,
}) {}

export class Presence extends Record({
    state: "offline" as io.PresenceState,
    timestamp: "0",
}) {}

export class StatusRecord extends Record({
    id: "0",
    name: "",
    state: "",
    timeout: 0,
}) {}

export class UserStateRecord extends Record({
    icon: "",
    status: "",
    timeout: 0,
}) {}

export class UserRecord
    extends Record(
        {
            id: "0" as Id,
            name: "",
            username: "",
            email: "",
            phone: "",
            verified: false,
            avatar: null as any as string,
            bio: "",
            state: new UserStateRecord({}),
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
            data.state = new UserStateRecord(data.state);
        }
        return data;
    }

    static make(payload: any) {
        return new UserRecord(UserRecord.objectFromJS(payload));
    }
}
