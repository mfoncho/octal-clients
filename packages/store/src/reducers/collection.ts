import { Record, List, Map } from "immutable";
import * as CatalogActions from "../actions/catalog";
import { sort } from "@colab/common";
import * as Actions from "../actions/types";
import { CollectionRecord } from "../records";

const positionSort = sort("index", "asc");

export class CollectionsStore extends Record({
    catalogs: Map<string, List<string>>(),
    entities: Map<string, CollectionRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }
    getCollection(id: string) {
        return this.entities.get(id);
    }

    getSpaceCollections(id: string) {
        return this.catalogs.get(id);
    }

    removeSpaceCollections(id: string): CollectionsStore {
        return this.withMutations((store) => {
            const catalogs = store.catalogs.get(id);
            if (catalogs) {
                catalogs.forEach((id) => store.removeCollection(id));
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

                // index catalog_id
                let catalogs = store.catalogs.get(collection.catalog_id, List<string>());
                if (!catalogs.includes(collection.catalog_id))
                    store.setIn(
                        ["catalogs", collection.catalog_id],
                        catalogs.push(collection.id)
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
                    store.catalogs
                        .get(collection.catalog_id, List<string>())
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
            const catalog = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== catalog.id;

                // index user_id
                let catalogs = store.catalogs.get(catalog.catalog_id, List<string>());
                if (catalogs.includes(catalog.catalog_id))
                    store.setIn(["catalogs"], catalogs.filter(filter));

                store.deleteIn(["entities", catalog.id]);
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
        { payload }: CatalogActions.CollectionCreatedAction
    ) => {
        return store.putCollection(payload);
    },
    [Actions.COLLECTION_LOADED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionLoadedAction
    ) => {
        return store.putCollection(payload);
    },

    [Actions.CATALOG_DELETED]: (store: CollectionsStore, { payload }: any) => {
        let cids = store.catalogs.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((store, id) => {
                return store.removeCollection(id);
            }, store);
        }
        return store;
    },

    [Actions.COLLECTIONS_LOADED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionsLoadedAction
    ) => {
        return payload.reduce(
            (store, payload) => store.putCollection(payload),
            store
        );
    },

    [Actions.COLLECTION_UPDATED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },
    [Actions.COLLECTIONS_UPDATED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionsUpdatedAction
    ) => {
        return payload.reduce(
            (store: CollectionsStore, collection: any) => store.patchCollection(collection),
            store
        );
    },

    [Actions.COLLECTIONS_REORDERED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionsReorderedAction
    ) => {
        return payload.reduce((store, col) => {
            return store.patchCollection(col);
        }, store);
    },

    [Actions.COLLECTION_MOVED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionMovedAction
    ) => {
        return store.patchCollection(payload);
    },

    [Actions.COLLECTION_ARCHIVED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },

    [Actions.COLLECTION_UNARCHIVED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionUpdatedAction
    ) => {
        return store.patchCollection(payload);
    },
    [Actions.COLLECTION_DELETED]: (
        store: CollectionsStore,
        { payload }: CatalogActions.CollectionDeletedAction
    ) => {
        return store.removeCollection(payload.id);
    },
};

export default { state, reducers };
