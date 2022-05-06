import { Record, fromJS, Map, OrderedMap } from "immutable";
import { Unique, BelongsToSpace, Id, ThreadType } from "@octal/client";
import { MessageRecord } from "./message";

export class ConversationLoading extends Record({
    top: false,
    bottom: false,
}) {}

export class ChatMessage extends Record({
    id: "",
    user_id: "",
    reply_id: null as any as string,
    timestamp: "",
}) {}

export class ThreadView extends Record({
    // Message scrollTop
    top: 0,
    // Middle message id
    mid: "",

    // scrollPercentage
    precentage: 100,

    // Follow new messages by
    // auto scroll bottom
    follow: true,
}) {}

export class ThreadHistory extends Record({}) {}

export class ThreadRecord
    extends Record({
        id: "0" as Id,
        type: "" as ThreadType,
        init: false,
        is_active: false,
        created_at: "",
        space_id: "0" as Id,
        message_count: 0,
        last_message_id: "" as Id,
        first_message_id: "" as Id,
        unread_message_count: 0,

        // Virtual fields
        highlight: "0",
        loading: new ConversationLoading(),
        view: new ThreadView(),
        messages: Map<string, MessageRecord>(),
        hcache: OrderedMap<string, ChatMessage>(),
        history: OrderedMap<string, ChatMessage>(),
    })
    implements Unique, BelongsToSpace
{
    static mapFromJS(data: any) {
        return fromJS(ThreadRecord.objectFromJS(data));
    }

    static objectFromJS(data: any) {
        return data;
    }

    get is_reply() {
        return this.type == "reply";
    }

    getStorePath(): [Id, Id] {
        return [this.space_id, this.id];
    }

    getHistoryAtIndex(index: number): ChatMessage | undefined {
        if (this.history.size > 0) {
            const chat: any = this.history;
            const msg = chat._list.get(index);
            if (msg) {
                return msg[1];
            }
        }
    }

    getHistoryIndex(id: string): number | undefined {
        if (this.history.size > 0) {
            const chat: any = this.history;
            return chat._map.get(id);
        }
    }
}
