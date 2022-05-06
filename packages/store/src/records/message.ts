import { Record, List, fromJS } from "immutable";
import { Unique, Id, Timestamped, BelongsToThread } from "@octal/client";
import { Slater } from "@octal/markdown";

const slater = Slater.create();

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
        id: "" as Id,
        content: "",
        pinned: false,
        attachement: null as any,
        embedded: [],
        flagged: false,
        user_id: "" as Id,
        markdown: false,
        timestamp: "",
        thread_id: "" as Id,
        space_id: "" as Id,
        reply_id: null as string | null,
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
            (this as any)._parsed = slater.parse(this.content);
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
