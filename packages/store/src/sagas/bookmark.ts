import { dispatch } from "..";
import client, { io } from "@colab/client";
import * as Actions from "../actions/types";
import * as UserActions from "../actions/user";
import * as BookmarkActions from "../actions/bookmark";
import { put, all, takeEvery } from "redux-saga/effects";

function* loadBookmarks(): Iterable<any> {
    try {
        const bookmarks = (yield client.fetchBookmarks({})) as any;
        let actions = [];
        for (let bookmark of bookmarks) {
            actions.push(put(BookmarkActions.bookmarkLoaded(bookmark)));
        }
        if (actions.length > 0) yield all(actions);
    } catch (e) {}
}

function* createBookmark({
    payload,
    resolve,
}: BookmarkActions.CreateBookmarkAction): Iterable<any> {
    try {
        const bookmark = (yield client.createBookmark({
            ...payload,
        })) as any;
        yield put(BookmarkActions.bookmarkCreated(bookmark));
        resolve.success(bookmark);
    } catch (e) {
        resolve.error(e);
    }
}

function* updateBookmark({
    payload,
    resolve,
}: BookmarkActions.UpdateBookmarkAction): Iterable<any> {
    try {
        const bookmark = (yield client.updateBookmark(payload)) as any;
        yield put(BookmarkActions.bookmarkUpdated(bookmark));
        resolve.success(bookmark);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteBookmark({
    payload,
    resolve,
}: BookmarkActions.DeleteBookmarkAction): Iterable<any> {
    try {
        yield client.deleteBookmark(payload.id);
        yield put(BookmarkActions.bookmarkDeleted(payload));
        resolve.success(payload);
    } catch (e) {
        resolve.error(e);
    }
}
function* subscribe({
    payload,
}: UserActions.UserConnectedAction): Iterable<any> {
    const { channel } = payload;

    channel.on("bookmark.created", (payload: io.Bookmark) => {
        dispatch(BookmarkActions.bookmarkCreated(payload));
    });

    channel.on("bookmark.updated", (payload: io.Bookmark) => {
        dispatch(BookmarkActions.bookmarkUpdated(payload));
    });

    channel.on("bookmark.deleted", (payload: io.Bookmark) => {
        dispatch(BookmarkActions.bookmarkDeleted(payload));
    });
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.AUTH_LOADED,
        handler: loadBookmarks,
    },
    {
        effect: takeEvery,
        type: Actions.USER_CONNECTED,
        handler: subscribe,
    },
    {
        effect: takeEvery,
        type: Actions.CREATE_BOOKMARK,
        handler: createBookmark,
    },
    {
        effect: takeEvery,
        type: Actions.UPDATE_BOOKMARK,
        handler: updateBookmark,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_BOOKMARK,
        handler: deleteBookmark,
    },
];
