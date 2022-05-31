import type { io } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    SEARCH_TOPIC,
    TOPIC_SEARCH_RESULT,
    LOAD_TOPICS,
    LOAD_TOPIC,
    CREATE_TOPIC,
    UPDATE_TOPIC,
    DELETE_TOPIC,
    TOPIC_CREATED,
    TOPIC_UPDATED,
    ARCHIVE_TOPIC,
    UNARCHIVE_TOPIC,
    TOPIC_ARCHIVED,
    TOPIC_UNARCHIVED,
    TOPIC_DELETED,
    TOPIC_LOADED,
    TOPICS_LOADED,
    TOPIC_FILTER_UPDATED,
} from "./types";

export * from "./types";

export interface SearchTopicPayload {
    topic_id: string;
    space_id: string;
    params: {
        offset?: number;
        query: string;
        users?: string[];
        start?: string;
        end?: string;
    };
}

export interface TopicFilterUpdatedPayload {
    topic_id: string;
    type: string;
    value: string | string[];
}

export interface CreateTopicPayload {
    space_id: string;
    name: string;
    type: string;
    subject?: string;
}

export interface LoadSpaceTopicsPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface LoadTopicPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface ArchiveTopicPayload {
    space_id: string;
    topic_id: string;
}

export interface UnarchiveTopicPayload {
    space_id: string;
    topic_id: string;
}

// Upgrade

export interface UpdateTopicPayload {
    space_id: string;
    topic_id: string;
    name: string;
    subject?: string;
}

// Destroy
export interface DeleteTopicPayload {
    space_id: string;
    topic_id: string;
}
export interface DeletedTopicPayload {
    id: string;
    space_id: string;
}
export type UpdateTopicAction = IOAction<
    UPDATE_TOPIC,
    UpdateTopicPayload,
    io.Topic
>;

export type LoadTopicAction = IOAction<LOAD_TOPIC, LoadTopicPayload, io.Topic>;

export type LoadSpaceTopicsAction = IOAction<
    LOAD_TOPICS,
    LoadSpaceTopicsPayload,
    io.Topic[]
>;

export type DeleteTopicAction = IOAction<DELETE_TOPIC, DeleteTopicPayload, any>;
export type TopicDeletedAction = Action<TOPIC_DELETED, DeletedTopicPayload>;

export type TopicUpdatedAction = Action<TOPIC_UPDATED, io.Topic>;

export type ArchiveTopicAction = IOAction<ARCHIVE_TOPIC, ArchiveTopicPayload>;
export type UnarchiveTopicAction = IOAction<
    UNARCHIVE_TOPIC,
    UnarchiveTopicPayload
>;

export type SearchTopicAction = IOAction<
    SEARCH_TOPIC,
    SearchTopicPayload,
    io.TopicSearchResult
>;

export type TopicSearchResultAction = Action<
    TOPIC_SEARCH_RESULT,
    io.TopicSearchResult
>;

export type TopicArchivedAction = Action<TOPIC_ARCHIVED, io.Topic>;
export type TopicUnarchivedAction = Action<TOPIC_UNARCHIVED, io.Topic>;

export type CreateTopicAction = IOAction<
    CREATE_TOPIC,
    CreateTopicPayload,
    io.Topic
>;
export type TopicCreatedAction = Action<TOPIC_CREATED, io.Topic>;
export type TopicLoadedAction = Action<TOPIC_LOADED, io.Topic>;
export type TopicsLoadedAction = Action<TOPICS_LOADED, io.Topic[]>;

export type TopicFilterUpdatedAction = Action<
    TOPIC_FILTER_UPDATED,
    TopicFilterUpdatedPayload
>;

export function updateTopicFilter(
    topic_id: string,
    type: string,
    value: string | string[]
): TopicFilterUpdatedAction {
    return createAction(TOPIC_FILTER_UPDATED, { topic_id, type, value });
}

export function archiveTopic(payload: ArchiveTopicPayload): ArchiveTopicAction {
    return createIOAction<ARCHIVE_TOPIC>(ARCHIVE_TOPIC, payload);
}

export function unarchiveTopic(
    payload: UnarchiveTopicPayload
): UnarchiveTopicAction {
    return createIOAction<UNARCHIVE_TOPIC>(UNARCHIVE_TOPIC, payload);
}

export function topicArchived(payload: io.Topic): TopicArchivedAction {
    return createAction(TOPIC_ARCHIVED, payload);
}

export function topicUnarchived(payload: io.Topic): TopicUnarchivedAction {
    return createAction(TOPIC_UNARCHIVED, payload);
}

export function createTopic(payload: CreateTopicPayload): CreateTopicAction {
    return createIOAction<CREATE_TOPIC>(CREATE_TOPIC, payload);
}

export function topicCreated(payload: io.Topic): TopicCreatedAction {
    return createAction(TOPIC_CREATED, payload);
}

export function putTopic(payload: io.Topic): TopicLoadedAction {
    return createAction(TOPIC_LOADED, payload);
}

export function updateTopic(payload: UpdateTopicPayload): UpdateTopicAction {
    return createIOAction<UPDATE_TOPIC>(UPDATE_TOPIC, payload);
}

export function topicsLoaded(payload: io.Topic[]): TopicsLoadedAction {
    return createAction(TOPICS_LOADED, payload);
}

export function topicLoaded(payload: io.Topic): TopicLoadedAction {
    return createAction(TOPIC_LOADED, payload);
}

export function topicUpdated(payload: io.Topic): TopicUpdatedAction {
    return createAction(TOPIC_UPDATED, payload);
}

export function deleteTopic(payload: DeleteTopicPayload): DeleteTopicAction {
    return createIOAction<DELETE_TOPIC>(DELETE_TOPIC, payload);
}

export function topicDeleted(payload: DeletedTopicPayload): TopicDeletedAction {
    return createAction(TOPIC_DELETED, payload);
}

export function loadTopic(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadTopicAction {
    return createIOAction<LOAD_TOPIC>(LOAD_TOPIC, { id, params });
}

export function searchTopic(payload: SearchTopicPayload): SearchTopicAction {
    return createIOAction<SEARCH_TOPIC, any>(SEARCH_TOPIC, payload);
}

export function searchResult(
    payload: io.TopicSearchResult
): TopicSearchResultAction {
    return createAction(TOPIC_SEARCH_RESULT, payload);
}

export function loadSpaceTopics(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadSpaceTopicsAction {
    return createIOAction<LOAD_TOPICS>(LOAD_TOPICS, { id, params });
}
