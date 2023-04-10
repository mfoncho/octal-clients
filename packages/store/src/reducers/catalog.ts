import { Record, Map, List } from "immutable";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import * as CatalogActions from "../actions/catalog";
import { CatalogRecord } from "../records";

const collections = ["records", "collections", "archived_records"];

export class CatalogsStore extends Record({
    loaded: Map<string, List<string>>(),
    spaces: Map<string, List<string>>(),
    entities: Map<string, CatalogRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }

    putLoaded(id: string, type: string) {
        let loaded = this.loaded.get(id, List<string>());
        if (!loaded.includes(type)) {
            return this.setIn(["loaded", id], loaded.push(type));
        }
        return this;
    }

    getCatalog(id: string) {
        return this.entities.get(id);
    }

    getSpaceCatalogs(id: string) {
        return this.spaces.get(id);
    }

    removeSpaceCatalogs(id: string): CatalogsStore {
        return this.withMutations((store) => {
            const catalogs = store.spaces.get(id);
            if (catalogs) {
                catalogs.forEach((id) => store.removeCatalog(id));
            }
        });
    }

    patchLabel(payload: any): CatalogsStore {
        const catalog = this.getCatalog(payload.catalog_id);
        if (catalog) {
            return this.putCatalog(catalog.patchLabel(payload));
        }
        return this;
    }

    putLabel(payload: any): CatalogsStore {
        const catalog = this.getCatalog(payload.catalog_id);
        if (catalog) {
            return this.putCatalog(catalog.putLabel(payload));
        }
        return this;
    }

    removeLabel(payload: any): CatalogsStore {
        const catalog = this.getCatalog(payload.catalog_id);
        if (catalog) {
            return this.putCatalog(catalog.removeLabel(payload.id));
        }
        return this;
    }

    putCatalog(payload: any): CatalogsStore {
        if (this.contains(payload.id)) {
            if (payload instanceof CatalogRecord) {
                return this.setIn(["entities", payload.id], payload);
            }
            return this;
        } else {
            const catalog = CatalogRecord.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", payload.id], catalog);

                // index space_id
                let catalogs = store.spaces.get(catalog.space_id, List<string>());
                if (!catalogs.includes(catalog.id))
                    store.setIn(
                        ["spaces", catalog.space_id],
                        catalogs.push(catalog.id)
                    );
            });
        }
    }
    patchCatalog(payload: any): CatalogsStore {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const catalog = this.entities.get(payload.id)!;
            const updated = catalog.patch(payload);
            return this.setIn(["entities", catalog.id], updated);
        }
    }

    removeCatalog(id: string): CatalogsStore {
        if (!this.contains(id)) {
            return this;
        } else {
            const catalog = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== catalog.id;

                // index user_id
                let catalogs = store.spaces.get(catalog.space_id, List<string>());
                if (catalogs.includes(catalog.id))
                    store.setIn(
                        ["spaces", catalog.space_id],
                        catalogs.filter(filter)
                    );

                store.deleteIn(["entities", catalog.id]);
            });
        }
    }
}
export const state = new CatalogsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.RECORD_TEMPLATE_CREATED](
        store: CatalogsStore,
        { payload }: CatalogActions.RecordTemplateCreatedAction
    ) {
        let catalog = store.getCatalog(payload.catalog_id);
        if (catalog) {
            catalog = catalog.putTemplate(payload);
            return store.setIn(["entities", catalog.id], catalog);
        }
        return store;
    },
    [Actions.RECORD_TEMPLATE_DELETED](
        store: CatalogsStore,
        { payload }: CatalogActions.RecordTemplateDeletedAction
    ) {
        let catalog = store.getCatalog(payload.catalog_id);
        if (catalog) {
            catalog = catalog.removeTemplate(payload);
            return store.setIn(["entities", catalog.id], catalog);
        }
        return store;
    },
    [Actions.CATALOG_FILTER_UPDATED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogFilterUpdatedAction
    ) => {
        let catalog = store.getCatalog(payload.catalog_id);
        if (catalog) {
            catalog = catalog.updateFilter(payload.filter, payload.value);
            return store.setIn(["entities", payload.catalog_id], catalog);
        }
        return store;
    },
    [Actions.CATALOG_ARCHIVED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogArchivedAction
    ) => {
        return store.patchCatalog({ ...payload, collection_id: null });
    },
    [Actions.CATALOG_UNARCHIVED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogArchivedAction
    ) => {
        return store.patchCatalog(payload);
    },
    [Actions.CATALOG_CREATED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogCreatedAction
    ) => {
        return store.putCatalog(payload);
    },
    [Actions.CATALOG_LOADED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogLoadedAction
    ) => {
        return store.putCatalog(payload);
    },

    [Actions.COLLECTION_LOADED]: (
        store: CatalogsStore,
        { payload }: AppActions.DataLoadedAction
    ) => {
        const catalog = store.getCatalog(payload.collection);
        if (catalog && collections.includes(payload.type)) {
            return store.setIn(
                ["entities", payload.collection],
                catalog.addLoaded(payload.type)
            );
        }
        return store;
    },

    [Actions.CATALOGS_LOADED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogsLoadedAction
    ) => {
        return payload.reduce((store, catalog) => {
            return store.putCatalog(catalog);
        }, store);
    },

    [Actions.CATALOG_UPDATED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogUpdatedAction
    ) => {
        return store.patchCatalog(payload);
    },

    [Actions.SPACE_PURGED]: (store: CatalogsStore, { payload }: any) => {
        return store.removeSpaceCatalogs(payload.space_id);
    },

    [Actions.LABEL_LOADED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.LabelLoadedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_CREATED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.LabelCreatedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_UPDATED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogLabelUpdated
    ) => {
        return store.patchLabel(payload);
    },

    [Actions.LABEL_DELETED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.LabelDeletedAction
    ) => {
        return store.removeLabel(payload);
    },

    [Actions.CATALOG_PURGED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogPurgedAction
    ) => {
        return store.removeCatalog(payload.id);
    },

    [Actions.CATALOG_DELETED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogDeletedAction
    ) => {
        return store.removeCatalog(payload.id);
    },

    [Actions.RECORDS_LOADED]: (
        store: CatalogsStore,
        { metadata }: CatalogActions.RecordsLoadedAction
    ) => {
        if (metadata && metadata.type == "catalog") {
            return store.putLoaded(metadata.root_id, "records");
        }
        return store;
    },

    [Actions.COLLECTIONS_LOADED]: (store: CatalogsStore, { metadata }: any) => {
        if (metadata && metadata.type == "catalog") {
            return store.putLoaded(metadata.root_id, "collections");
        }
        return store;
    },
    [Actions.CATALOG_CONNECTED]: (
        store: CatalogsStore,
        { payload }: CatalogActions.CatalogConnectedAction
    ) => {
        let catalog = store.getCatalog(payload.id);
        if (catalog) {
            catalog = catalog.setChannel(payload.channel);
        }
        return store.putCatalog(catalog);
    },
};

export default { state, reducers };
