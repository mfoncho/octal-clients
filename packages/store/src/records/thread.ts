import { Record, fromJS, List, OrderedMap } from "immutable";
import { Unique, BelongsToSpace, Id, ThreadType } from "@octal/client";

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

export class HistoryUpdateOption {
    after?: string;
    before?: string;
    around?: string;
    first?: number;
    last?: number;
}

type History = OrderedMap<string, ChatMessage>;

function updateHasMoreBottom(history: History, params: HistoryUpdateOption) {
    return (
        Boolean(params.after) &&
        params.first === history.size &&
        params.last === undefined &&
        params.before === undefined &&
        params.around === undefined
    );
}

function updateHasMoreTop(history: History, params: HistoryUpdateOption) {
    return (
        Boolean(params.before) &&
        params.first === history.size &&
        params.last === undefined &&
        params.after === undefined &&
        params.around === undefined
    );
}

export class ThreadPageView extends Record({
    end: "",

    start: "",

    // pivote identifier
    pivot: "",

    // pivote top offset
    pivotTop: -1,

    // Follow new messages by
    // auto scroll bottom
    autoScroll: true,

    // scrollPercentage
    scrollPercentage: 100,
}) {}

export class ThreadDraft extends Record({
    value: "",
    files: [] as File[],
}) {}

function orderedMapValueAt<T>(
    map: OrderedMap<string, T>,
    index: number
): T | undefined {
    if (map.size > 0) {
        const msg = (map as any)._list.get(index);
        if (msg) {
            return msg[1];
        }
    }
}

function orderedMapAtIndex<T>(
    map: OrderedMap<string, T>,
    index: string
): number | undefined {
    if (map.size > 0) {
        return (map as any)._map.get(index);
    }
}

export class ThreadRecord
    extends Record({
        id: "0" as Id,
        type: "" as ThreadType,
        init: false,
        is_active: false,
        type_id: "",
        draft: new ThreadDraft(),
        created_at: "",
        space_id: "0" as Id,
        message_count: 0,
        last_seen: "" as Id,
        last_read: "" as Id,
        unread_count: 0,

        // Virtual fields
        highlight: "0",
        loading: new ConversationLoading(),
        page: new ThreadPageView(),
        hasMoreTop: true,
        hasMoreBottom: true,
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

    static nearestIndexByTimestamp<T extends { id: string; timestamp: string }>(
        source: OrderedMap<string, T>,
        timestamp: string
    ): number {
        let history = source;
        while (history.size > 1) {
            let mid = Math.floor(history.size / 2);
            let middle = orderedMapValueAt(history, mid)!;

            if (middle.timestamp === timestamp) {
                history = OrderedMap({ [middle.id]: middle });
            } else if (middle.timestamp < timestamp) {
                history = history.skip(orderedMapAtIndex(history, middle.id)!);
            } else if (middle.timestamp > timestamp) {
                history = history.skipLast(
                    history.size - orderedMapAtIndex(history, middle.id)!
                );
            }
        }
        if (history.size > 0) {
            return orderedMapAtIndex(source, history.first()!.id)!;
        } else {
            return -1;
        }
    }

    get is_reply() {
        return this.type == "reply";
    }

    getStorePath(): [Id, Id] {
        return [this.space_id, this.id];
    }

    getNearestIndex(timestamp: string) {
        return ThreadRecord.nearestIndexByTimestamp(this.history, timestamp);
    }

    historyFrom(start: string, end?: string) {
        let { history } = this;
        if (Boolean(start)) {
            let startIndex = ThreadRecord.nearestIndexByTimestamp(
                history,
                start
            );
            history = history.skip(startIndex);
        }
        if (Boolean(end)) {
            let endIndex = ThreadRecord.nearestIndexByTimestamp(history, end!);
            history = history.skipLast(history.size - (endIndex + 1));
        }
        return history;
    }

    updateDraft(draft: any) {
        return this.update("draft", (daft) => daft.merge(draft));
    }

    getHistoryAtIndex(index: number): ChatMessage | undefined {
        return orderedMapValueAt(this.history, index);
    }

    getHistoryIndex(id: string): number | undefined {
        return orderedMapAtIndex(this.history, id);
    }

    appendNewMessage(payload: any) {
        let thread = this;
        let history = thread.history;
        let message = new ChatMessage(payload);
        if (!thread.hasMoreBottom) {
            history = thread.history.set(message.id, message);
        }
        return thread.set("history", history);
    }

    updateHistory(
        chat: OrderedMap<string, ChatMessage>,
        params: HistoryUpdateOption
    ) {
        let thread = this;

        let history = thread.history;
        let first = history.first();
        let last = history.last();
        let hasMoreTop = thread.hasMoreTop;
        let hasMoreBottom = thread.hasMoreBottom;

        if (
            params.around === undefined &&
            params.before === undefined &&
            params.after === undefined &&
            params.last === undefined &&
            params.first
        ) {
            if (chat.size >= params.first) {
                hasMoreTop = true;
            } else {
                hasMoreTop = false;
            }
            history = chat;
            hasMoreBottom = false;
        } else if (first?.id === params.before && params.first) {
            if (!chat.isEmpty()) {
                history = chat.concat(thread.history);
            }

            hasMoreTop = updateHasMoreTop(chat, params);
        } else if (last?.id === params.after && params.first) {
            if (!chat.isEmpty()) {
                history = thread.history.concat(chat);
            }
            hasMoreBottom = updateHasMoreBottom(chat, params);
        }

        return thread
            .set("history", history)
            .set("hasMoreTop", hasMoreTop)
            .set("hasMoreBottom", hasMoreBottom);
    }

    updatePage(payload: Partial<ThreadPageView>) {
        let thread = this.update("page", (page) => {
            return page.merge(payload);
        });
        if (thread.page.autoScroll && !thread.hasMoreBottom) {
            thread = thread
                .set("unread_count", 0)
                .set("last_read", this.history.last()?.get("timestamp") ?? "");
        }

        return thread;
    }
}
