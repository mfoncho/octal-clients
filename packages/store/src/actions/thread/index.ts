import type { Channel } from "@colab/endpoint";
import type { Require } from "@colab/common";
import type { io } from "@colab/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedMessage } from "../../schemas";
import {
    SEARCH_THREAD,
    DELETE_THREAD,
    CREATE_THREAD,
    RENAME_THREAD,
    THREAD_CONNECTED,
    THREAD_SEARCH_RESULT,
    THREAD_DRAFT_REPLY_SET,
    THREAD_PAGE_UPDATED,
    CONVERSATION_LOADED,
    THREAD_DRAFT_UPDATED,
    REACTION_CREATED,
    REACTION_DELETED,
    REACTION_LOADED,
    THREAD_CREATED,
    THREAD_DELETED,
    POST_MESSAGE,
    THREAD_UPDATED,
    LOAD_THREAD,
    THREAD_LOADED,
    DELETE_MESSAGE,
    REACT_MESSAGE,
    UNREACT_MESSAGE,
    PIN_MESSAGE,
    THREAD_ACTIVITY,
    UNPIN_MESSAGE,
    LOAD_CONVERSATION,
    GET_THREAD,
    USER_REACTED,
    USER_UNREACTED,
    UPDATE_MESSAGE,
    NEW_MESSAGE,
    TRIM_CONVSERSATION,
    POST_DIRECT_MESSAGE,
    SET_CONVERSATION_PAGE,
    INIT_CONVERSATION,
    CREATE_CONVERSATION,
    FETCH_MESSAGES,
    LOADING_CONVERSATION,
    MESSAGES_LOADED,
    MESSAGE_LOADED,
    MESSAGE_UPDATED,
    MESSAGE_DELETED,
    CONCAT_CONVERSATION,
    THREAD_SEARCH_FILTER_UPDATED,
    ARCHIVE_THREAD,
    UNARCHIVE_THREAD,
    THREAD_ARCHIVED,
    THREAD_UNARCHIVED,
} from "./types";

export * from "./types";

export interface CreateThreadPayload {
    space_id: string;
    params: {
        name: string;
    };
}

export interface RenameThreadPayload extends CreateThreadPayload {
    thread_id: string;
}

export interface SearchThreadPayload {
    space_id: string;
    thread_id: string;
    params: {
        page?: number;
        query: string;
        users?: string[];
        before?: string;
        after?: string;
    };
}

export interface ArchiveThreadPayload {
    space_id: string;
    thread_id: string;
}

export interface UnarchiveThreadPayload {
    thread_id: string;
    space_id: string;
}

export interface DeleteThreadPayload {
    thread_id: string;
    space_id: string;
}
export interface ThreadDraftReplySetPayload {
    thread_id: string;
    reply_id: string;
}

export interface ThreadPageUpdatedPayload {
    thread_id: string;
    params: {
        end?: string;
        start?: string;
        pivot?: string;
        pivoteTop?: number;
        autoScroll?: boolean;
        scrollPercentage?: number;
    };
}

export interface ThreadConnectedPayload {
    thread_id: string;
    channel: Channel;
}

export interface PostDirectMessagePayload {
    user_id: string;
    params: {
        content: string;
        attachment?: File;
    };
}

export interface ThreadDraftUpdatedPayload {
    space_id: string;
    thread_id: string;
    params: {
        reply?: string | null;
        value?: string;
        files?: File[];
    };
}

export interface TrimConversationPayload {
    mode: "top" | "bottom";
    amount: number;
    thread_id: string;
    space_id?: string;
}

export interface MessageReactionPayload {
    message_id: string;
    thead_id: string;
    user_id: string;
    reaction: string;
}

export interface MessageReactionDeletedPayload {
    message_id: string;
    thead_id: string;
    user_id: string;
    reaction: string;
}

export interface ThreadActivityPayload {
    type: string;
    thread_id: string;
    timestamp: string;
    params?: any;
}

export interface SetConversationPagePayload {
    mid: string;
    top: number;
    follow: boolean;
    thread_id: string;
    space_id: string;
}

export interface ConversationLoadParams {
    last?: number;
    first?: number;
    after?: string;
    before?: string;
    around?: string;
}

export interface ConversationLoadedPayload {
    thread_id: string;
    params: ConversationLoadParams;
    messages: NormalizedMessage[];
}

export interface LoadConversationPayload {
    thread_id: string;
    params: ConversationLoadParams;
}

export interface LoadThreadPayload {
    space_id: string;
    thread_id: string;
}

export interface UpdateMessagePayload {
    space_id?: string;
    thread_id: string;
    message_id: string;
    params: {
        content: string;
    };
}

export interface ConcatConversationPayload {
    thread_id: string;
    mode: "prepend" | "append";
    messages: NormalizedMessage[];
}

export interface PostMessagePayload {
    params: {
        embeds?: [];
        content: string;
        attachment?: File;
    };
    space_id: string;
    reply_id?: string;
    thread_id: string;
}

export type ThreadDeletedPayload = Require<
    Partial<io.Thread>,
    "id" | "space_id"
>;

export type MinimalMessage = Require<Partial<io.Message>, "id" | "thread_id">;

export interface InitConversationPayload {
    thread_id: string;
    space_id: string;
}

export interface FetchMessagesPayload {
    thread_id: string;
    space_id: string;
    page?: {
        limit?: number;
        after?: string;
        before?: string;
    };
}

export interface DeleteMessagePayload {
    space_id: string;
    thread_id: string;
    message_id: string;
}

export interface LoadingConversationPayload {
    thread_id: string;
    loading: {
        top?: boolean;
        bottom?: boolean;
    };
}

export interface ReactMessagePayload {
    message_id: string;
    thread_id: string;
    reaction: string;
}

export interface UnreactMessagePayload {
    message_id: string;
    thread_id: string;
    reaction: string;
}

export interface PinMessagePayload {
    message_id: string;
    thread_id: string;
}

export interface FlagMessagePayload {
    message_id: string;
    thread_id: string;
}

export interface UnpinMessagePayload {
    message_id: string;
    thread_id: string;
}

export interface UnflagMessagePayload {
    message_id: string;
    thread_id: string;
}

export interface MessagesLoadedPayload {
    prepend?: boolean;
    thread_id: string;
    messages: io.UserMessage[];
}

export interface MessageLoadedPayload {
    prepend?: boolean;
    message: io.UserMessage;
}

export interface GetThreadPayload {
    thread_id: string;
    space_id: string;
}

export interface ThreadSearchFilterUpdatedPayload {
    thread_id: string;
    type: string;
    value: string | string[];
}

export type CreateThreadAction = IOAction<
    CREATE_THREAD,
    CreateThreadPayload,
    io.Thread
>;

export type SearchThreadAction = IOAction<
    SEARCH_THREAD,
    SearchThreadPayload,
    io.TopicSearchResult
>;

export type ThreadSearchResultAction = Action<
    THREAD_SEARCH_RESULT,
    io.TopicSearchResult & SearchThreadPayload
>;

export type RenameThreadAction = IOAction<
    RENAME_THREAD,
    RenameThreadPayload,
    io.Thread
>;

export type DeleteThreadAction = IOAction<
    DELETE_THREAD,
    DeleteThreadPayload,
    any
>;
export type ArchiveThreadAction = IOAction<
    ARCHIVE_THREAD,
    ArchiveThreadPayload,
    io.Thread
>;

export type UnarchiveThreadAction = IOAction<
    UNARCHIVE_THREAD,
    UnarchiveThreadPayload,
    io.Thread
>;

export type ThreadArchivedAction = Action<THREAD_ARCHIVED, io.Thread>;
export type ThreadUnarchivedAction = Action<THREAD_UNARCHIVED, io.Thread>;
export type ThreadSearchFilterUpdatedAction = Action<
    THREAD_SEARCH_FILTER_UPDATED,
    ThreadSearchFilterUpdatedPayload
>;
export type ThreadDraftReplySetAction = Action<
    THREAD_DRAFT_REPLY_SET,
    ThreadDraftReplySetPayload
>;

export type ThreadConnectedAction = Action<
    THREAD_CONNECTED,
    ThreadConnectedPayload
>;

export type MessageReactionAction = Action<
    REACTION_LOADED,
    MessageReactionPayload
>;

export type ConversationLoadedAction = Action<
    CONVERSATION_LOADED,
    ConversationLoadedPayload
>;

export type ThreadPageUpdatedAction = Action<
    THREAD_PAGE_UPDATED,
    ThreadPageUpdatedPayload
>;

export type ReactionCreated = Action<REACTION_CREATED, MessageReactionPayload>;

export type ReactionDeletedAction = Action<
    REACTION_DELETED,
    MessageReactionDeletedPayload
>;

export type MessageLoadedAction = Action<MESSAGE_LOADED, NormalizedMessage>;

export type MessagesLoadedAction = Action<MESSAGES_LOADED, NormalizedMessage[]>;

export type CreateConversationAction = Action<
    CREATE_CONVERSATION,
    InitConversationPayload
>;

export type ConcatConversationAction = Action<
    CONCAT_CONVERSATION,
    ConcatConversationPayload
>;

export type MessageDeletedAction = Action<MESSAGE_DELETED, MinimalMessage>;

export type NewMessageAction = Action<NEW_MESSAGE, NormalizedMessage>;

export type LoadingConversationAction = Action<
    LOADING_CONVERSATION,
    LoadingConversationPayload
>;

export type ThreadLoadedAction = Action<THREAD_LOADED, io.Thread>;

export type MessageUpdatedAction = Action<MESSAGE_UPDATED, NormalizedMessage>;

export type GetThreadAction = IOAction<GET_THREAD, GetThreadPayload, io.Thread>;

export type LoadThreadAction = IOAction<
    LOAD_THREAD,
    LoadThreadPayload,
    io.Thread
>;

export type InitConversationAction = IOAction<
    INIT_CONVERSATION,
    InitConversationPayload,
    undefined
>;

export type PostDirectMessageAction = IOAction<
    POST_DIRECT_MESSAGE,
    PostDirectMessagePayload,
    io.Message
>;

export type ReactMessageAction = IOAction<
    REACT_MESSAGE,
    ReactMessagePayload,
    io.Message
>;

export type UnreactMessageAction = IOAction<
    UNREACT_MESSAGE,
    UnreactMessagePayload,
    io.Message
>;

export type DeleteMessageAction = IOAction<
    DELETE_MESSAGE,
    DeleteMessagePayload,
    any
>;

export type UpdateMessageAction = IOAction<
    UPDATE_MESSAGE,
    UpdateMessagePayload,
    io.Message
>;

export type FetchMessagesAction = IOAction<
    FETCH_MESSAGES,
    FetchMessagesPayload,
    io.UserMessage
>;

export type PinMessageAction = IOAction<
    PIN_MESSAGE,
    PinMessagePayload,
    io.Message
>;

export type UnpinMessageAction = IOAction<
    UNPIN_MESSAGE,
    UnpinMessagePayload,
    io.Message
>;

export type PostMessageAction = IOAction<
    POST_MESSAGE,
    PostMessagePayload,
    io.Message
>;

export type ThreadActivityAction = Action<
    THREAD_ACTIVITY,
    ThreadActivityPayload
>;

export type SetConversationPageAction = Action<
    SET_CONVERSATION_PAGE,
    SetConversationPagePayload
>;

export interface MessageReactionPayload {
    thread_id?: string;
    user_id: string;
    reaction: string;
    message_id: string;
}

export type ThreadCreatedAction = Action<THREAD_CREATED, io.Thread>;

export type ThreadUpdatedAction = Action<THREAD_UPDATED, io.Thread>;

export type ThreadDeletedAction = Action<THREAD_DELETED, ThreadDeletedPayload>;

export type LoadConversationAction = IOAction<
    LOAD_CONVERSATION,
    LoadConversationPayload,
    io.Message[]
>;

export type UserReactedAction = Action<USER_REACTED, MessageReactionPayload>;

export type UserUnreactedAction = Action<
    USER_UNREACTED,
    MessageReactionPayload
>;

export type TrimConversationAction = Action<
    TRIM_CONVSERSATION,
    TrimConversationPayload
>;

export type ThreadDraftUpdatedAction = Action<
    THREAD_DRAFT_UPDATED,
    ThreadDraftUpdatedPayload
>;

export function setConversationPage(
    payload: SetConversationPagePayload
): SetConversationPageAction {
    return createAction(SET_CONVERSATION_PAGE, payload);
}

export function messageLoaded(payload: NormalizedMessage): MessageLoadedAction {
    return {
        type: MESSAGE_LOADED,
        payload: payload,
    };
}

export function postMessage(payload: PostMessagePayload): PostMessageAction {
    return createIOAction<POST_MESSAGE>(POST_MESSAGE, payload);
}

export function pinMesssag(payload: PinMessagePayload): PinMessageAction {
    return createIOAction<PIN_MESSAGE>(PIN_MESSAGE, payload);
}

export function unpinMesssag(payload: UnpinMessagePayload): UnpinMessageAction {
    return createIOAction<UNPIN_MESSAGE>(UNPIN_MESSAGE, payload);
}

export function deleteMessage(
    payload: DeleteMessagePayload
): DeleteMessageAction {
    return createIOAction<DELETE_MESSAGE>(DELETE_MESSAGE, payload);
}

export function messagesLoaded(
    payload: NormalizedMessage[]
): MessagesLoadedAction {
    return createAction(MESSAGES_LOADED, payload);
}

export function createConversation(
    payload: InitConversationPayload
): CreateConversationAction {
    return createAction(CREATE_CONVERSATION, payload);
}

export function loadingConversation(
    payload: LoadingConversationPayload
): LoadingConversationAction {
    return createAction(LOADING_CONVERSATION, payload);
}

export function getThread(payload: GetThreadPayload): GetThreadAction {
    return createIOAction<GET_THREAD>(GET_THREAD, payload);
}

export function initConversation(
    payload: InitConversationPayload
): InitConversationAction {
    return createIOAction<INIT_CONVERSATION>(INIT_CONVERSATION, payload);
}

export function messageDeleted(message: MinimalMessage): MessageDeletedAction {
    return createAction(MESSAGE_DELETED, message);
}

export function updateMessage(
    payload: UpdateMessagePayload
): UpdateMessageAction {
    return createIOAction<UPDATE_MESSAGE>(UPDATE_MESSAGE, payload);
}

export function threadLoaded(payload: io.Thread): ThreadLoadedAction {
    return createAction(THREAD_LOADED, payload);
}

export function loadThread(payload: LoadThreadPayload): LoadThreadAction {
    return createIOAction<LOAD_THREAD>(LOAD_THREAD, payload);
}

export function threadActivity(
    payload: ThreadActivityPayload
): ThreadActivityAction {
    return createAction(THREAD_ACTIVITY, payload);
}

export function concatConversation(payload: ConcatConversationPayload) {
    return createAction(CONCAT_CONVERSATION, payload);
}

export function newMessage(payload: NormalizedMessage): NewMessageAction {
    return createAction(NEW_MESSAGE, payload);
}

export function messageUpdated(
    payload: NormalizedMessage
): MessageUpdatedAction {
    return createAction(MESSAGE_UPDATED, payload);
}

export function reactMessage(payload: ReactMessagePayload): ReactMessageAction {
    return createIOAction<REACT_MESSAGE>(REACT_MESSAGE, payload);
}

export function userReacted(
    reaction: MessageReactionPayload
): UserReactedAction {
    return createAction(USER_REACTED, reaction);
}

export function userUnreacted(
    reaction: MessageReactionPayload
): UserUnreactedAction {
    return createAction(USER_UNREACTED, reaction);
}

export function unreactMessage(
    payload: UnreactMessagePayload
): UnreactMessageAction {
    return createIOAction<UNREACT_MESSAGE>(UNREACT_MESSAGE, payload);
}

export function threadCreated(payload: io.Thread): ThreadCreatedAction {
    return createAction(THREAD_CREATED, payload);
}

export function threadUpdated(payload: io.Thread): ThreadUpdatedAction {
    return createAction(THREAD_UPDATED, payload);
}

export function threadDeleted(
    payload: ThreadDeletedPayload
): ThreadDeletedAction {
    return createAction(THREAD_DELETED, payload);
}

export function loadConversation(
    id: string,
    params: ConversationLoadParams
): LoadConversationAction {
    return createIOAction<LOAD_CONVERSATION>(LOAD_CONVERSATION, {
        thread_id: id,
        params,
    });
}

export function postDirectMessage(
    payload: PostDirectMessagePayload
): PostDirectMessageAction {
    return createIOAction<POST_DIRECT_MESSAGE>(POST_DIRECT_MESSAGE, payload);
}

export function reactionLoaded(
    payload: MessageReactionPayload
): MessageReactionAction {
    return createAction(REACTION_LOADED, payload);
}

export function trimConversation(
    params: TrimConversationPayload
): TrimConversationAction {
    return createAction(TRIM_CONVSERSATION, params);
}

export function fetchMessages(
    payload: FetchMessagesPayload
): FetchMessagesAction {
    return createIOAction<FETCH_MESSAGES>(FETCH_MESSAGES, payload);
}

export function updateDaft(
    payload: ThreadDraftUpdatedPayload
): ThreadDraftUpdatedAction {
    return createAction(THREAD_DRAFT_UPDATED, payload, { push: true });
}

export function conversationLoaded(
    payload: ConversationLoadedPayload
): ConversationLoadedAction {
    return createAction(CONVERSATION_LOADED, payload);
}

export function setDraftReply(
    payload: ThreadDraftReplySetPayload
): ThreadDraftReplySetAction {
    return createAction(THREAD_DRAFT_REPLY_SET, payload);
}

export function threadConnected(
    payload: ThreadConnectedPayload
): ThreadConnectedAction {
    return createAction(THREAD_CONNECTED, payload);
}

export function updateThreadPage(
    id: string,
    params: ThreadPageUpdatedPayload["params"]
): ThreadPageUpdatedAction {
    return createAction(THREAD_PAGE_UPDATED, { thread_id: id, params });
}

export function updateThreadSearchFilter(
    thread_id: string,
    type: string,
    value: string | string[]
): ThreadSearchFilterUpdatedAction {
    return createAction(THREAD_SEARCH_FILTER_UPDATED, {
        thread_id,
        type,
        value,
    });
}

export function createThread(payload: CreateThreadPayload): CreateThreadAction {
    return createIOAction(CREATE_THREAD, payload);
}

export function renameThread(payload: RenameThreadPayload): RenameThreadAction {
    return createIOAction(RENAME_THREAD, payload);
}

export function archiveThread(
    payload: ArchiveThreadPayload
): ArchiveThreadAction {
    return createIOAction(ARCHIVE_THREAD, payload);
}

export function unarchiveThread(
    payload: UnarchiveThreadPayload
): UnarchiveThreadAction {
    return createIOAction(UNARCHIVE_THREAD, payload);
}

export function threadUnarchived(payload: io.Thread): ThreadUnarchivedAction {
    return createIOAction(THREAD_UNARCHIVED, payload);
}

export function threadArchived(payload: io.Thread): ThreadArchivedAction {
    return createIOAction(THREAD_ARCHIVED, payload);
}

export function deleteThread(payload: DeleteThreadPayload): DeleteThreadAction {
    return createIOAction(DELETE_THREAD, payload);
}

export function searchThread(payload: SearchThreadPayload): SearchThreadAction {
    return createIOAction<SEARCH_THREAD, any>(SEARCH_THREAD, payload);
}

export function threadSearchResult(
    payload: io.TopicSearchResult & SearchThreadPayload
): ThreadSearchResultAction {
    return createAction(THREAD_SEARCH_RESULT, payload);
}
