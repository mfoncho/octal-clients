import { Record, List, fromJS } from "immutable";
import { Unique, Id, Timestamped, BelongsToThread } from "@octal/client";
import markdown from "@octal/markdown";

export class UsersReactionRecord extends Record({
    reaction: "love",
    users: List<Id>(),
}) {
    constructor(params: any) {
        super(UsersReactionRecord.mapFromJS(params) as any);
    }

    static mapFromJS(data: any) {
        return fromJS(UsersReactionRecord.objectFromJS(data));
    }

    static objectFromJS(data: any) {
        return data;
    }
}

export class MessageRecord
    extends Record({
        id: "0" as Id,
        content: "",
        pinned: false,
        attachement: null as any,
        embedded: [],
        flagged: false,
        user_id: "0" as Id,
        markdown: false,
        timestamp: "",
        thread_id: "0" as Id,
        space_id: "0" as Id,
        reply_thread_id: null as string | null,
        reactions: List<UsersReactionRecord>(),
        last_reply: null as MessageRecord | null,
    })
    implements Unique, Timestamped, BelongsToThread
{
    _parsed: any;

    constructor(params: any) {
        super(MessageRecord.mapFromJS(params) as any);
        this._parsed = null;
    }

    patch(data: any) {
        this.merge(MessageRecord.objectFromJS(data));
    }

    getPath() {
        return [this.thread_id, "messages", this.id];
    }

    get parsed(): any {
        if (Boolean(this._parsed)) {
            return this._parsed;
        }
        if (Boolean(this.content)) {
            (this as any)._parsed = markdown.parse(this.content);
            return this._parsed;
        }
        return this._parsed;
    }

    static mapFromJS(data: any) {
        return fromJS(MessageRecord.objectFromJS(data));
    }

    static objectFromJS(data: any) {
        if (data.reactions) {
            data = {
                ...data,
                reactions: List(
                    data.reactions.map(
                        (rtx: any) => new UsersReactionRecord(rtx)
                    )
                ),
            };
        }
        return data;
    }
}
