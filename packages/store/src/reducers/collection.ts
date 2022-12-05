import { Record, List, Map } from "immutable";
import * as BoardActions from "../actions/board";
import { sort } from "@colab/common";
import * as Actions from "../actions/types";
import { CollectionRecord } from "../records";

const positionSort = sort("index", "asc");

export class CollectionsStore extends Record({
    boards: Map<string, List<string>>(),
    entities: Map<string, CollectionRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }
    getCollection(id: string) {
        return this.entities.get(id);
    }

    getSpaceCollections(id: string) {
        return this.boards.get(id);
    }

    removeSpaceCollections(id: string): CollectionsStore {
        return this.withMutations((store) => {
            const boards = store.boards.get(id);
            if (boards) {
                boards.forEach((id) => store.removeCollection(id));
            }
        });
    }

    putCollection(payload: any): CollectionsStore {
        if (this.contains(payload.id)) {
            return this.patchCollection(payload);
        } else {
            const collection = CollectionRecord.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", collection.id], collection);

                // index board_id
                let boards = store.boards.get(collection.board_id, List<string>());
                if (!boards.includes(collection.board_id))
                    store.setIn(
                        ["boards", collection.board_id],
                        boards.push(collection.id)
                    );
            });
        }
    }
    patchCollection(payload: any): CollectionsStore {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const collection = this.entities.get(payload.id)!;
            const updated = collection.patch(payload);
            if (collection.index !== updated.index) {
                return this.withMutations((store) => {
                    store.boards
                        .get(collection.board_id, List<string>())
                        .map((id) => this.getCollection(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .filter((col) => col.id !== collection.id)
                        .insert(updated.index, updated)
                        .forEach((collection, index) => {
                            store.setIn(
                                ["entities", collection.id],
                                collection.merge({ index: index })
                            );
                        });
                });
            }
            return this.setIn(["entities", collection.id], updated);
        }
    }

    removeCollection(id: string): CollectionsStore {
        if (!this.contains(id)) {
            return this;
        } else {
            const board = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== board.id;

                // index user_id
                let boards = store.boards.get(board.board_id, List<string>());
                if (boards.includes(board.board_id))
                    store.setIn(["boards"], boards.filter(filter));

                store.deleteIn(["entities", board.id]);
            });
        }
    }
}

export const state = new CollectionsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.COLLECTION_CREATED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionCreatedAction
    ) => {
        return store.putCollection(payload);
    },
    [Actions.COLLECTION_LOADED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionLoadedAction
    ) => {
        return store.putCollection(payload);
    },

    [Actions.BOARD_DELETED]: (store: CollectionsStore, { payload }: any) => {
        let cids = store.boards.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((store, id) => {
                return store.removeCollection(id);
            }, store);
        }
        return store;
    },

    [Actions.COLLECTIONS_LOADED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionsLoadedAction
    ) => {
        return payload.reduce(
            (store, payload) => store.putCollection(payload),
            store
        );
    },

    [Actions.COLLECTION_UPDATED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },
    [Actions.COLLECTIONS_UPDATED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionsUpdatedAction
    ) => {
        return payload.reduce(
            (store: CollectionsStore, collection: any) => store.patchCollection(collection),
            store
        );
    },

    [Actions.COLLECTIONS_REORDERED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionsReorderedAction
    ) => {
        return payload.reduce((store, col) => {
            return store.patchCollection(col);
        }, store);
    },

    [Actions.COLLECTION_MOVED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionMovedAction
    ) => {
        return store.patchCollection(payload);
    },

    [Actions.COLLECTION_ARCHIVED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },

    [Actions.COLLECTION_UNARCHIVED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },
    [Actions.COLLECTION_DELETED]: (
        store: CollectionsStore,
        { payload }: BoardActions.CollectionDeletedAction
    ) => {
        return store.removeCollection(payload.id);
    },
};

export default { state, reducers };
