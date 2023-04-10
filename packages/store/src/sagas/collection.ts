import { put, all, takeEvery } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch } from "..";
import { CollectionSchema } from "../schemas";
import * as Actions from "../actions/types";
import * as CatalogActions from "../actions/catalog";
import * as AppActions from "../actions/app";

function* normalize(payload: io.Collection | io.Collection[]): Iterable<any> {
    let [collections, related] = CollectionSchema.normalize(payload);
    yield put(AppActions.relatedLoaded(related as any) as any);
    return collections;
}

function* load(collections: any): Iterable<any> {
    let actions = collections.map((collection: any) => {
        return put(CatalogActions.collectionLoaded(collection));
    });
    yield all(actions);
}

function* normalizeLoad(collections: io.Collection[]): Iterable<any> {
    collections = yield* normalize(collections);
    yield* load(collections);
}

function* fetch({
    payload,
    resolve,
}: CatalogActions.FetchCollectionsAction): Iterable<any> {
    try {
        const data = (yield client.fetchCollections(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* catalogLoadedLoadCatalogCollections({
    payload,
}: CatalogActions.CatalogLoadedAction): Iterable<any> {
    yield put(CatalogActions.loadCatalogCollections({ catalog_id: payload.id }));
}

function* loadCatalogCollections({
    payload,
    resolve,
}: CatalogActions.LoadCollectionsAction): Iterable<any> {
    try {
        const task = yield put(CatalogActions.fetchCollections(payload));

        const collections = (yield task) as any;

        yield* normalizeLoad(collections);
        yield put(
            AppActions.dataLoaded(payload.catalog_id, "collections", collections)
        );

        resolve.success(collections);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: CatalogActions.MoveCollectionAction): Iterable<any> {
    try {
        yield put(
            CatalogActions.collectionMoved({
                id: payload.collection_id,
                index: payload.index,
            })
        );
        const data = (yield client.moveCollection(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let collections = CollectionSchema.getCollection(payload as any);
    if (collections.length > 0) {
        yield* load(collections);
    }
}

function* archive({
    payload,
    resolve,
}: CatalogActions.ArchiveCollectionAction): Iterable<any> {
    try {
        const data = (yield client.archiveCollection(payload)) as any;
        yield put(CatalogActions.collectionArchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: CatalogActions.UnarchiveCollectionAction): Iterable<any> {
    try {
        const data = (yield client.unarchiveCollection(payload)) as any;
        yield put(CatalogActions.collectionUnarchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: CatalogActions.UpdateCollectionAction): Iterable<any> {
    try {
        const data = (yield client.updateCollection(payload)) as any;
        yield put(CatalogActions.collectionUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: CatalogActions.DeleteCollectionAction): Iterable<any> {
    try {
        const data = (yield client.deleteCollection(payload)) as any;
        const params = {
            id: payload.collection_id,
            catalog_id: payload.catalog_id,
        };
        yield put(CatalogActions.collectionDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* create({
    payload,
    resolve,
}: CatalogActions.CreateCollectionAction): Iterable<any> {
    try {
        const data = (yield client.createCollection(payload)) as any;
        yield put(CatalogActions.collectionCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({ payload }: CatalogActions.CatalogConnectedAction) {
    const { channel } = payload;
    channel.on("collection.created", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionCreated(payload));
    });

    channel.on("collection.updated", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionUpdated(payload as any));
    });

    channel.on("collection.archived", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionUpdated(payload as any));
    });

    channel.on("collection.unarchived", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionUpdated(payload as any));
    });

    channel.on("collection.deleted", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionDeleted(payload));
    });

    channel.on("collection.moved", (payload: io.Collection) => {
        dispatch(CatalogActions.collectionMoved(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.CATALOG_CONNECTED, handler: subscribe },

    {
        effect: takeEvery,
        type: Actions.CATALOG_LOADED,
        handler: catalogLoadedLoadCatalogCollections,
    },

    { effect: takeEvery, type: Actions.CREATE_COLLECTION, handler: create },

    { effect: takeEvery, type: Actions.DELETE_COLLECTION, handler: trash },

    { effect: takeEvery, type: Actions.UPDATE_COLLECTION, handler: update },

    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.FETCH_COLLECTIONS, handler: fetch },

    {
        effect: takeEvery,
        type: Actions.LOAD_COLLECTIONS,
        handler: loadCatalogCollections,
    },

    { effect: takeEvery, type: Actions.MOVE_COLLECTION, handler: move },

    { effect: takeEvery, type: Actions.ARCHIVE_COLLECTION, handler: archive },

    { effect: takeEvery, type: Actions.UNARCHIVE_COLLECTION, handler: unarchive },
];
