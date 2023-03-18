import { put, all, takeEvery } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch } from "..";
import { CollectionSchema } from "../schemas";
import * as Actions from "../actions/types";
import * as BoardActions from "../actions/board";
import * as SpaceActions from "../actions/space";
import * as AppActions from "../actions/app";

function* normalize(payload: io.Collection | io.Collection[]): Iterable<any> {
    let [collections, related] = CollectionSchema.normalize(payload);
    yield put(AppActions.relatedLoaded(related as any) as any);
    return collections;
}

function* load(collections: any): Iterable<any> {
    let actions = collections.map((collection: any) => {
        return put(BoardActions.collectionLoaded(collection));
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
}: BoardActions.FetchCollectionsAction): Iterable<any> {
    try {
        const data = (yield client.fetchCollections(payload)) as any;
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadSpaceCollection({
    payload,
}: SpaceActions.SpaceLoadedAction): Iterable<any> {
    yield put(BoardActions.loadBoardCollections({ space_id: payload.id! }));
}

function* loadBoardCollections({
    payload,
    resolve,
}: BoardActions.LoadCollectionsAction): Iterable<any> {
    try {
        const task = yield put(BoardActions.fetchCollections(payload));

        const collections = (yield task) as any;

        yield* normalizeLoad(collections);
        yield put(
            AppActions.dataLoaded(payload.space_id, "collections", collections)
        );

        resolve.success(collections);
    } catch (e) {
        resolve.error(e);
    }
}

function* move({
    payload,
    resolve,
}: BoardActions.MoveCollectionAction): Iterable<any> {
    try {
        yield put(
            BoardActions.collectionMoved({
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
}: BoardActions.ArchiveCollectionAction): Iterable<any> {
    try {
        const data = (yield client.archiveCollection(payload)) as any;
        yield put(BoardActions.collectionArchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: BoardActions.UnarchiveCollectionAction): Iterable<any> {
    try {
        const data = (yield client.unarchiveCollection(payload)) as any;
        yield put(BoardActions.collectionUnarchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: BoardActions.UpdateCollectionAction): Iterable<any> {
    try {
        const data = (yield client.updateCollection(payload)) as any;
        yield put(BoardActions.collectionUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: BoardActions.DeleteCollectionAction): Iterable<any> {
    try {
        const data = (yield client.deleteCollection(payload)) as any;
        const params = {
            id: payload.collection_id,
            space_id: payload.space_id,
        };
        yield put(BoardActions.collectionDeleted(params));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* create({
    payload,
    resolve,
}: BoardActions.CreateCollectionAction): Iterable<any> {
    try {
        const data = (yield client.createCollection(payload)) as any;
        yield put(BoardActions.collectionCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* subscribe({ payload }: BoardActions.BoardConnectedAction) {
    const { channel } = payload;
    channel.on("collection.created", (payload: io.Collection) => {
        dispatch(BoardActions.collectionCreated(payload));
    });

    channel.on("collection.updated", (payload: io.Collection) => {
        dispatch(BoardActions.collectionUpdated(payload as any));
    });

    channel.on("collection.archived", (payload: io.Collection) => {
        dispatch(BoardActions.collectionUpdated(payload as any));
    });

    channel.on("collection.unarchived", (payload: io.Collection) => {
        dispatch(BoardActions.collectionUpdated(payload as any));
    });

    channel.on("collection.deleted", (payload: io.Collection) => {
        dispatch(BoardActions.collectionDeleted(payload));
    });

    channel.on("collection.moved", (payload: io.Collection) => {
        dispatch(BoardActions.collectionMoved(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.SPACE_CONNECTED, handler: subscribe },

    {
        effect: takeEvery,
        type: Actions.SPACE_LOADED,
        handler: loadSpaceCollection,
    },

    { effect: takeEvery, type: Actions.CREATE_COLLECTION, handler: create },

    { effect: takeEvery, type: Actions.DELETE_COLLECTION, handler: trash },

    { effect: takeEvery, type: Actions.UPDATE_COLLECTION, handler: update },

    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },

    { effect: takeEvery, type: Actions.FETCH_COLLECTIONS, handler: fetch },

    {
        effect: takeEvery,
        type: Actions.LOAD_COLLECTIONS,
        handler: loadBoardCollections,
    },

    { effect: takeEvery, type: Actions.MOVE_COLLECTION, handler: move },

    { effect: takeEvery, type: Actions.ARCHIVE_COLLECTION, handler: archive },

    {
        effect: takeEvery,
        type: Actions.UNARCHIVE_COLLECTION,
        handler: unarchive,
    },
];
