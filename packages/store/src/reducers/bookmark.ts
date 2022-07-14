import { Map, Record } from "immutable";
import { BookmarkRecord } from "../records";
import { io } from "@octal/client";
import * as Actions from "../actions/types";
import * as BookmarkActions from "../actions/bookmark";

export class BookmarksStore extends Record({
    bookmarked: Map<string, string>(),
    entities: Map<string, BookmarkRecord>(),
}) {
    putBookmark(payload: io.Bookmark) {
        let bookmarked = this.bookmarked.has(payload.entity)
            ? this.bookmarked
            : this.bookmarked.set(payload.entity, payload.id);
        let entities = this.entities.set(
            payload.id,
            new BookmarkRecord(payload)
        );
        return this.set("entities", entities).set("bookmarked", bookmarked);
    }

    updateBookmark(payload: io.Bookmark) {
        let bookmark = this.entities.get(payload.id);
        if (bookmark) {
            return this.setIn(
                ["entities", payload.id],
                bookmark.merge(payload)
            );
        }
        return this;
    }
    isBookmarked(entity_id: string) {
        return Boolean(this.bookmarked.get(entity_id));
    }
    getEntityBookmark(entity_id: string) {
        let id = this.bookmarked.get(entity_id);
        return this.entities.get(id ?? "");
    }
    deleteBookmark(id: string) {
        let bookmark = this.entities.get(id)!;
        if (bookmark) {
            let entities = this.entities.delete(bookmark.id);
            let bookmarked = this.bookmarked.delete(bookmark.entity);
            return this.set("entities", entities).set("bookmarked", bookmarked);
        }
        return this;
    }
}

const state = new BookmarksStore();

export type State = typeof state;

export const reducers = {
    [Actions.LOGOUT](_store: any, _action: any) {
        return state;
    },
    [Actions.BOOKMARK_LOADED](
        store: BookmarksStore,
        { payload }: BookmarkActions.BookmarkLoadedAction
    ) {
        return store.putBookmark(payload);
    },
    [Actions.BOOKMARK_CREATED](
        store: BookmarksStore,
        { payload }: BookmarkActions.BookmarkLoadedAction
    ) {
        return store.putBookmark(payload);
    },
    [Actions.BOOKMARK_UPDATED](
        store: BookmarksStore,
        { payload }: BookmarkActions.BookmarkLoadedAction
    ) {
        return store.updateBookmark(payload);
    },
    [Actions.BOOKMARK_DELETED](
        store: BookmarksStore,
        { payload }: BookmarkActions.BookmarkDeletedAction
    ) {
        return store.deleteBookmark(payload.id);
    },
    [Actions.LOGOUT](_store: BookmarksStore, _action: any) {
        return new BookmarksStore();
    },
};

export default { state, reducers };
