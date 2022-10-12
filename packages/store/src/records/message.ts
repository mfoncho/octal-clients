import { Record, List, fromJS } from "immutable";
import { FileRecord } from "./workspace";
import { Unique, Id, Timestamped, HasThread } from "@colab/client";
import { Slater } from "@colab/markdown";

const slater = Slater.create();

export class UsersReactionRecord extends Record({
    reaction: "",
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
        attachment: null as FileRecord | null,
        embedded: [],
        user_id: "" as Id,
        markdown: false,
        timestamp: "",
        thread_id: "" as Id,
        space_id: "" as Id,
        reply_id: null as string | null,
        reactions: List<UsersReactionRecord>(),
        last_reply: null as MessageRecord | null,
    })
    implements Unique, Timestamped, HasThread
{
    __parsed__: any;

    constructor(params: any) {
        super(MessageRecord.mapFromJS(params) as any);
        this.__parsed__ = null;
    }

    patch(data: any) {
        this.merge(MessageRecord.objectFromJS(data));
    }

    getPath() {
        return [this.thread_id, "messages", this.id];
    }

    get parsed(): any {
        if (Boolean(this.__parsed__)) {
            return this.__parsed__;
        }
        if (Boolean(this.content)) {
            (this as any).__parsed__ = slater.parse(this.content);
            return this.__parsed__;
        }
        return this.__parsed__;
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
        if (data.attachment) {
            data = {
                ...data,
                attachment: new FileRecord(data.attachment),
            };
        }

        return data;
    }
}
