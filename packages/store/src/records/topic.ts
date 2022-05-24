import { Record } from "immutable";
import { Unique, Id } from "@octal/client";

export class TopicRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        type: "",
        subject: "",
        is_main: false,
        space_id: "",
        thread_id: "",
        created_at: "",
        is_archived: false,
        archived_at: null as null | string,
    })
    implements Unique
{
    get is_email() {
        return this.type == "email";
    }

    get is_chat() {
        return this.type == "chat";
    }

    patch(payload: any) {
        return this.merge(payload);
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload.merge(payload) as any as TopicRecord;
        }
        return new TopicRecord(payload);
    }
}
