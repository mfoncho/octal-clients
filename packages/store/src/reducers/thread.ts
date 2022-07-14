import { Record, Map, OrderedMap } from "immutable";
import * as ThreadActions from "../actions/thread";
import {
    LoadingConversationAction,
    MessageLoadedAction,
    MessagesLoadedAction,
    TrimConversationAction,
    ThreadLoadedAction,
    ThreadsLoadedAction,
} from "../actions/thread";
import * as Actions from "../actions/types";
import {
    ThreadRecord,
    MessageRecord,
    ChatMessage,
    UsersReactionRecord,
} from "../records";
import { Id, Timestamped, Unique } from "../types";

const sort = (a: Timestamped & Unique, b: Timestamped & Unique) => {
    if (a.timestamp < b.timestamp) return -1;

    if (a.timestamp > b.timestamp) return 1;

    return 0;
};

export class Conversations extends Record(
    {
        paths: Map<Id, Id>(),
        threads: Map<Id, ThreadRecord>(),
        messages: Map<Id, MessageRecord>(),
    },
    "threads"
) {
    hasMessage(id: string) {
        return this.messages.has(id);
    }

    hasThread(id: string) {
        return this.threads.has(id);
    }

    getThread(id: string): ThreadRecord | undefined {
        return this.threads.get(id);
    }

    getMessage(id: string): MessageRecord | undefined {
        return this.messages.get(id);
    }

    deleteThread({ id }: { id: string }) {
        return this.update("threads", (threads) => threads.delete(id));
    }

    updateDraft(payload: ThreadActions.ThreadDraftUpdatedPayload) {
        if (this.threads.has(payload.thread_id))
            return this.updateIn(["threads", payload.thread_id], (thread) =>
                (thread as ThreadRecord).updateDraft(payload.params)
            );
        return this;
    }

    deleteMessage(id: string) {
        const message = this.messages.get(id);
        if (message) {
            return this.deleteIn(["threads", message.thread_id, "hcache", id])
                .deleteIn(["threads", message.thread_id, "history", id])
                .deleteIn(["messages", id]);
        }
        return this;
    }

    storeMessage(message: MessageRecord) {
        return this.setIn(["messages", message.id], message);
    }

    udpateMessage(partial: Partial<MessageRecord>) {
        const message = this.messages.get(partial.id!);
        if (message) {
            return this.storeMessage(message.merge(partial));
        }
        return this;
    }

    updateThread(partial: Partial<ThreadRecord>) {
        if (this.threads.has(partial.id!)) {
            return this.updateIn(["threads", partial.id], (thread) => {
                return (thread as ThreadRecord).patch(partial);
            });
        }
        return this;
    }

    storeThread(thread: ThreadRecord) {
        const prev = this.getThread(thread.id);
        if (prev) {
            thread = prev.merge(thread);
        }
        return this.setIn(["threads", thread.id], thread);
    }
}

export const state = new Conversations();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.THREAD_LOADED]: (
        state: Conversations,
        { payload }: ThreadActions.ThreadLoadedAction
    ) => {
        const thread = new ThreadRecord(payload as any);
        return state.storeThread(thread);
    },

    [Actions.THREAD_DRAFT_UPDATED]: (
        state: Conversations,
        { payload }: ThreadActions.ThreadDraftUpdatedAction
    ) => {
        return state.updateDraft(payload);
    },

    [Actions.THREADS_LOADED]: (
        state: Conversations,
        { payload }: ThreadActions.ThreadsLoadedAction
    ) => {
        return payload.reduce((state, thr) => {
            const thread = new ThreadRecord(thr as any);
            return state.storeThread(thread);
        }, state);
    },

    [Actions.THREAD_UPDATED]: (
        state: Conversations,
        { payload }: ThreadActions.ThreadUpdatedAction
    ) => {
        return state.updateThread(payload as any);
    },

    [Actions.USER_REACTED]: (
        state: Conversations,
        { payload }: ThreadActions.MessageReactionAction
    ) => {
        let message = state.getMessage(payload.message_id);
        if (!message) return state;
        message = message.update("reactions", (reactions) => {
            let ureaction = reactions.find(
                (reaction) => reaction.reaction == payload.reaction
            );
            if (ureaction) {
                if (ureaction.users.includes(payload.user_id)) {
                    return reactions;
                }

                return reactions.map((reaction) => {
                    if (reaction.reaction == ureaction!.reaction) {
                        return ureaction!.update("users", (users) => {
                            return users.concat(payload.user_id);
                        });
                    }
                    return reaction;
                }) as any;
            } else {
                ureaction = new UsersReactionRecord(payload).update(
                    "users",
                    (users) => {
                        return users.concat(payload.user_id);
                    }
                );
                return reactions.concat([ureaction]);
            }
        });
        return state.storeMessage(message);
    },

    [Actions.USER_UNREACTED]: (
        state: Conversations,
        { payload }: ThreadActions.ReactionDeletedAction
    ) => {
        let message = state.getMessage(payload.message_id);
        if (!message) return state;
        message = message.update("reactions", (reactions) => {
            return reactions
                .map((reaction) => {
                    if (reaction.reaction == payload.reaction) {
                        return reaction.update("users", (users) => {
                            return users.filter((id) => {
                                return id !== payload.user_id;
                            });
                        });
                    }
                    return reaction;
                })
                .filter((reaction) => !reaction.users.isEmpty()) as any;
        });
        return state.storeMessage(message);
    },

    [Actions.THREAD_DELETED]: (
        state: Conversations,
        { payload }: ThreadActions.ThreadDeletedAction
    ) => {
        return state.deleteThread(payload);
    },

    [Actions.MESSAGE_UPDATED]: (
        state: Conversations,
        { payload }: ThreadActions.MessageDeletedAction
    ) => {
        return state.withMutations((state) => {
            const partial = MessageRecord.objectFromJS(payload);
            state.udpateMessage(partial);
        });
    },

    [Actions.NEW_MESSAGE]: (
        state: Conversations,
        { payload }: ThreadActions.NewMessageAction
    ) => {
        return state.withMutations((state) => {
            if (!state.threads.has(payload.thread_id!)) return;

            const path = ["threads", payload.thread_id];

            let thread = state.getIn(path) as ThreadRecord;

            state.storeMessage(new MessageRecord(payload));

            state.setIn(path, thread.appendNewMessage(payload));
        });
    },

    [Actions.CONVERSATION_LOADED]: (
        state: Conversations,
        { payload }: ThreadActions.ConversationLoadedAction
    ) => {
        return state.withMutations((state) => {
            if (!state.threads.has(payload.thread_id)) return;

            const path = ["threads", payload.thread_id];

            let thread = state.getIn(path) as ThreadRecord;

            const chat = OrderedMap<string, ChatMessage>()
                .withMutations((partials) => {
                    payload.messages.forEach((message) => {
                        if (!thread.history.has(message.id as any)) {
                            let record = new MessageRecord(message);
                            let partial = new ChatMessage(message as any);
                            state.storeMessage(record);
                            partials.set(record.id, partial);
                        }
                    });
                })
                .sort(sort);

            state.setIn(path, thread.updateHistory(chat, payload.params));
        });
    },

    [Actions.TRIM_CONVSERSATION]: (
        state: Conversations,
        { payload }: TrimConversationAction
    ) => {
        return state.withMutations((state) => {
            if (!state.threads.has(payload.thread_id)) return;

            const path = ["threads", payload.thread_id];

            state.updateIn(path, (val) => {
                let thread = val as ThreadRecord;
                switch (payload.mode) {
                    case "top": {
                        return thread.set(
                            "history",
                            thread.history.takeLast(payload.amount)
                        );
                    }
                    case "bottom": {
                        return thread.set(
                            "history",
                            thread.history.take(payload.amount)
                        );
                    }
                    default:
                        return thread;
                }
            });
        });
    },

    [Actions.MESSAGE_LOADED]: (
        state: Conversations,
        { payload }: ThreadActions.MessageLoadedAction
    ) => {
        return state.withMutations((state) => {
            const record = new MessageRecord(payload);
            state.storeMessage(record);
        });
    },

    [Actions.MESSAGES_LOADED]: (
        state: Conversations,
        { payload }: ThreadActions.MessagesLoadedAction
    ) => {
        return state.withMutations((state) => {
            payload.forEach((message) => {
                const record = new MessageRecord(message);
                state.storeMessage(record);
            });
        });
    },

    [Actions.MESSAGE_DELETED]: (
        state: Conversations,
        { payload }: ThreadActions.MessageDeletedAction
    ) => {
        return state.withMutations((state) => {
            state.deleteMessage(payload.id);
        });
    },

    [Actions.LOADING_CONVERSATION]: (
        state: Conversations,
        { payload }: LoadingConversationAction
    ) => {
        return state.withMutations((state) => {
            if (state.threads.has(payload.thread_id)) {
                const path = ["threads", payload.thread_id];
                state.mergeIn([...path, "loading"], payload.loading);
            }
        });
    },

    [Actions.THREAD_PAGE_UPDATED]: (
        store: Conversations,
        { payload }: ThreadActions.ThreadPageUpdatedAction
    ) => {
        let thread = store.getThread(payload.thread_id);
        if (thread) {
            return store.storeThread(thread.updatePage(payload.params));
        }
        return store;
    },
};

export default { state, reducers };
