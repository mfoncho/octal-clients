import { Record, List } from "immutable";
import { Unique, Id } from "@octal/client";

export class Filter extends Record({
    since: "",
    until: "",
    search: "",
    users: List<string>(),
}) {}

export class TopicRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        type: "",
        filter: new Filter(),
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

    updateFilter(filter: string, value: string | string[] | List<string>) {
        if (Array.isArray(value)) {
            value = List(value);
        }
        return this.updateIn(["filter", filter], (_old) => value);
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload.merge(payload) as any as TopicRecord;
        }
        return new TopicRecord(payload);
    }
}
