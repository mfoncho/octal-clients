import type { io } from "@octal/client";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import {
    CREATE_BOOKMARK,
    UPDATE_BOOKMARK,
    DELETE_BOOKMARK,
    BOOKMARK_LOADED,
    BOOKMARK_CREATED,
    BOOKMARK_UPDATED,
    BOOKMARK_DELETED,
} from "./types";

export interface CreateBookmarkPayload {
    type: string;
    notes: string;
    entity: string;
}

export interface UpdateBookmarkPayload {
    bookmark_id: string;
    params: {
        notes: string;
    };
}

export interface DeleteBookmarkPayload {
    id: string;
    entity?: string;
}

export type CreateBookmarkAction = IOAction<
    CREATE_BOOKMARK,
    CreateBookmarkPayload,
    io.Bookmark
>;
export type UpdateBookmarkAction = IOAction<
    UPDATE_BOOKMARK,
    UpdateBookmarkPayload,
    io.Bookmark
>;
export type DeleteBookmarkAction = IOAction<
    DELETE_BOOKMARK,
    DeleteBookmarkPayload,
    any
>;

export type BookmarkLoadedAction = Action<BOOKMARK_LOADED, io.Bookmark>;
export type BookmarkCreatedAction = Action<BOOKMARK_CREATED, io.Bookmark>;
export type BookmarkUpdatedAction = Action<BOOKMARK_UPDATED, io.Bookmark>;
export type BookmarkDeletedAction = Action<
    BOOKMARK_DELETED,
    DeleteBookmarkPayload
>;

export function createBookmark(
    payload: CreateBookmarkPayload
): CreateBookmarkAction {
    return createIOAction<CREATE_BOOKMARK>(CREATE_BOOKMARK, payload);
}

export function updateBookmark(
    payload: UpdateBookmarkPayload
): UpdateBookmarkAction {
    return createIOAction<UPDATE_BOOKMARK>(UPDATE_BOOKMARK, payload);
}

export function deleteBookmark(
    payload: DeleteBookmarkPayload
): DeleteBookmarkAction {
    return createIOAction<DELETE_BOOKMARK>(DELETE_BOOKMARK, payload);
}

export function bookmarkCreated(payload: io.Bookmark): BookmarkCreatedAction {
    return createAction<BOOKMARK_CREATED>(BOOKMARK_CREATED, payload);
}

export function bookmarkLoaded(payload: io.Bookmark): BookmarkLoadedAction {
    return createAction<BOOKMARK_LOADED>(BOOKMARK_LOADED, payload);
}

export function bookmarkUpdated(payload: io.Bookmark): BookmarkUpdatedAction {
    return createAction<BOOKMARK_UPDATED>(BOOKMARK_UPDATED, payload);
}

export function bookmarkDeleted(
    payload: DeleteBookmarkPayload
): BookmarkDeletedAction {
    return createAction<BOOKMARK_DELETED>(BOOKMARK_DELETED, payload);
}
