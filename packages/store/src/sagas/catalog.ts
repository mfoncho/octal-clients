import { takeEvery, put, all, select } from "redux-saga/effects";
import client, { io } from "@colab/client";
import { dispatch, State } from "..";
import * as Actions from "../actions/types";
import * as CatalogActions from "../actions/catalog";
import * as SpaceActions from "../actions/space";
//import { CatalogSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* create({
    payload,
    resolve,
}: CatalogActions.CreateCatalogAction): Iterable<any> {
    try {
        const data = (yield client.createCatalog(payload)) as any;
        yield put(CatalogActions.catalogCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* loadCatalog({ payload }: any): Iterable<any> {
    yield put(CatalogActions.catalogLoaded(payload));
}

function* createRecordTemplate({
    payload,
    resolve,
}: CatalogActions.CreateRecordTemplateAction): Iterable<any> {
    try {
        const data = (yield client.createRecordTemplate(payload)) as any;
        yield put(CatalogActions.recordTemplateCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* deleteRecordTemplate({
    payload,
    resolve,
}: CatalogActions.DeleteRecordTemplateAction): Iterable<any> {
    try {
        const data = (yield client.deleteRecordTemplate(payload)) as any;
        yield put(
            CatalogActions.recordTemplateDeleted({
                id: payload.template_id,
                ...payload,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* archive({
    payload,
    resolve,
}: CatalogActions.ArchiveCatalogAction): Iterable<any> {
    try {
        const data = (yield client.archiveCatalog(payload)) as any;
        yield put(CatalogActions.catalogArchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* unarchive({
    payload,
    resolve,
}: CatalogActions.UnarchiveCatalogAction): Iterable<any> {
    try {
        const data = (yield client.unarchiveCatalog(payload)) as any;
        yield put(CatalogActions.catalogUnarchived(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve: meta,
}: CatalogActions.UpdateCatalogAction): Iterable<any> {
    try {
        const data = (yield client.updateCatalog(payload)) as any;
        yield put(CatalogActions.catalogUpdated(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* trash({
    payload,
    resolve: meta,
}: CatalogActions.DeleteCatalogAction): Iterable<any> {
    try {
        const data = (yield client.deleteCatalog({
            ...payload,
        })) as any;
        yield put(
            CatalogActions.catalogDeleted({
                id: payload.catalog_id,
                space_id: payload.space_id,
            })
        );
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* connect({ payload }: CatalogActions.CatalogLoadedAction): Iterable<any> {
    const topic = `catalog:${payload.id}`;

    if (client.topic(topic)) return;

    let channel = client.channel(topic);

    channel
        .subscribe()
        .receive("ok", () => { })
        .receive("error", () => { });

    yield put(CatalogActions.catalogConnected({ topic, channel, id: payload.id }));
}

function* load(catalogs: io.Catalog[]): Iterable<any> {
    let actions = catalogs.map((catalog) => {
        return put(CatalogActions.catalogLoaded(catalog));
    });
    yield all(actions);
}

/*
function* related({ payload }: AppActions.RelatedLoadedAction): Iterable<any> {
    let catalogs = Object.values(
        payload[CatalogSchema.collect] || {}
    ) as io.Catalog[];
    yield* load(catalogs);
}
*/

/*
function* loadCatalog({ payload }: CatalogActions.LoadCatalogAction): Iterable<any> {
    //const catalogs = yield client.getCatalog(payload.id);
    //yield put(CatalogActions.catalogLoaded(catalogs as any));
}
*/

function* loadSpaceCatalog({
    payload,
}: CatalogActions.LoadSpaceCatalogsAction): Iterable<any> {
    //@ts-ignore
    const catalogs: io.Catalog[] = yield client.fetchCatalogs(payload.id);
    yield* load(catalogs);
    yield put(AppActions.dataLoaded(payload.id, "catalogs", catalogs));
}

function* spaceLoaded({
    payload,
}: SpaceActions.SpaceLoadedAction): Iterable<any> {
    yield put(CatalogActions.loadSpaceCatalogs(payload.id!));
}

function* subscribeSpace({
    payload: { channel },
}: SpaceActions.SpaceConnectedAction): Iterable<any> {
    channel.on("catalog.created", (payload: io.Catalog) => {
        dispatch(CatalogActions.catalogCreated(payload));
    });
    channel.on("catalog.updated", (payload: io.Catalog) => {
        dispatch(CatalogActions.catalogUpdated(payload));
    });

    channel.on("catalog.archived", (payload: io.Catalog) => {
        dispatch(CatalogActions.catalogArchived(payload));
    });

    channel.on("catalog.unarchived", (payload: io.Catalog) => {
        dispatch(CatalogActions.catalogUnarchived(payload));
    });

    channel.on("catalog.deleted", (payload: io.Catalog) => {
        dispatch(CatalogActions.catalogDeleted(payload));
    });
}

function* subscribe({
    payload: { channel },
}: CatalogActions.CatalogConnectedAction): Iterable<any> {
    channel.on("record_template.created", (payload: io.RecordTemplate) => {
        dispatch(CatalogActions.recordTemplateCreated(payload));
    });
    channel.on("record_template.deleted", (payload: io.RecordTemplate) => {
        dispatch(CatalogActions.recordTemplateDeleted(payload));
    });
}

function* unsubscribe({
    payload,
}: CatalogActions.CatalogPurgedAction): Iterable<any> {
    const topic = `catalog:${payload.id}`;
    let channel = client.topic(topic);
    if (channel) {
        channel.unsubscribe();
    }
}

function* spacePurged({
    payload,
}: SpaceActions.SpacePurgedAction): Iterable<any> {
    const { catalogs } = (yield select()) as any as State;
    const bids = catalogs.spaces.get(payload.space_id);
    if (bids) {
        for (let id of bids.toArray()) {
            yield put(CatalogActions.purgeCatalog({ id }));
        }
    }
}

export const tasks = [
    {
        effect: takeEvery,
        type: Actions.SPACE_CONNECTED,
        handler: subscribeSpace,
    },
    { effect: takeEvery, type: Actions.CATALOG_CREATED, handler: loadCatalog },
    { effect: takeEvery, type: Actions.CATALOG_CONNECTED, handler: subscribe },
    {
        effect: takeEvery,
        type: Actions.LOAD_CATALOGS,
        handler: loadSpaceCatalog,
    },
    { effect: takeEvery, type: Actions.SPACE_LOADED, handler: spaceLoaded },
    {
        effect: takeEvery,
        type: Actions.SPACES_LOADED,
        handler: spaceLoaded,
    },
    {
        effect: takeEvery,
        type: Actions.CREATE_RECORD_TEMPLATE,
        handler: createRecordTemplate,
    },
    {
        effect: takeEvery,
        type: Actions.DELETE_RECORD_TEMPLATE,
        handler: deleteRecordTemplate,
    },
    { effect: takeEvery, type: Actions.CATALOG_PURGED, handler: unsubscribe },
    { effect: takeEvery, type: Actions.ARCHIVE_CATALOG, handler: archive },
    { effect: takeEvery, type: Actions.UNARCHIVE_CATALOG, handler: unarchive },
    { effect: takeEvery, type: Actions.CATALOG_LOADED, handler: connect },
    { effect: takeEvery, type: Actions.CREATE_CATALOG, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_CATALOG, handler: update },
    { effect: takeEvery, type: Actions.DELETE_CATALOG, handler: trash },
    { effect: takeEvery, type: Actions.SPACE_PURGED, handler: spacePurged },
];
