import type { io, BelongsToCatalog, Unique, BelongsToSpace } from "@colab/client";
import type { Channel } from "@colab/endpoint";
import type { Require } from "@colab/common";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedRecord, NormalizedCollection } from "../../schemas";
import {
    CATALOG_PURGED,
    LOAD_ARCHIVED_RECORDS,
    CATALOG_ARCHIVED,
    CATALOG_UNARCHIVED,
    ARCHIVE_CATALOG,
    UNARCHIVE_CATALOG,
    CATALOG_FILTER_UPDATED,
    CATALOG_CONNECTED,
    LOAD_CATALOG,
    LOAD_CATALOGS,
    CATALOG_COLLECTIONS_LOADED,
    CATALOG_RECORDS_LOADED,
    CATALOG_DELETED,
    CATALOGS_LOADED,
    COLLECTIONS_UPDATED,
    RECORDS_UPDATED,
    CREATE_CATALOG,
    CATALOG_CREATED,
    DELETE_CATALOG,
    LABEL_DELETED,
    LABEL_CREATED,
    CREATE_LABEL,
    DELETE_LABEL,
    UPDATE_LABEL,
    CATALOG_LOADED,
    LABEL_LOADED,
    LABELS_LOADED,
    MOVE_RECORD,
    ARCHIVE_COLLECTION,
    STORE_COLLECTIONS,
    UNARCHIVE_COLLECTION,
    MOVE_COLLECTION,
    UPDATE_COLLECTION,
    CREATE_RECORD,
    UPDATE_RECORD,
    RECORDS_REORDERED,
    STORE_RECORD,
    STORE_RECORDS,
    RECORD_LOADED,
    RECORDS_LOADED,
    RECORD_UPDATED,
    RECORD_DELETED,
    COLLECTION_DELETED,
    CREATE_COLLECTION,
    FETCH_RECORDS,
    COLLECTION_LOADED,
    COLLECTIONS_LOADED,
    COLLECTIONS_REORDERED,
    COLLECTION_UPDATED,
    ARCHIVE_RECORD,
    RECORD_CREATED,
    COLLECTION_CREATED,
    COLLECTION_ARCHIVED,
    COLLECTION_UNARCHIVED,
    GET_RECORD,
    RECORD_LABELED,
    RECORD_UNLABELED,
    RECORD_ARCHIVED,
    RECORD_UNARCHIVED,
    DELETE_RECORD,
    RECORD_MOVED,
    CHECK_RECORD,
    UNCHECK_RECORD,
    LOAD_RECORDS,
    LOAD_RECORD,
    LOAD_COLLECTIONS,
    FETCH_COLLECTIONS,
    DELETE_COLLECTION,
    UPDATE_RECORD_FIELD,
    COLLECTION_MOVED,
    UPDATE_CATALOG,
    ASSIGN_CHECKLIST,
    CHECKLIST_ASSIGNED,
    LABEL_UPDATED,
    CREATE_RECORD_FIELD,
    DELETE_RECORD_FIELD,
    RECORD_FIELD_UPDATED,
    RECORD_FIELD_DELETED,
    MOVE_RECORD_FIELD,
    RECORD_FIELD_MOVED,
    RECORD_FIELD_CREATED,
    SET_RECORD_FIELD,
    DELETE_RECORD_FIELD_VALUE,
    CREATE_RECORD_FIELD_VALUE,
    UPDATE_RECORD_FIELD_VALUE,
    RECORD_FIELD_VALUE_DELETED,
    RECORD_FIELD_VALUE_UPDATED,
    RECORD_FIELD_VALUE_CREATED,
    UNASSIGN_CHECKLIST,
    CHECKLIST_UNASSIGNED,
    CATALOG_UPDATED,
    CREATE_RECORD_TEMPLATE,
    DELETE_RECORD_TEMPLATE,
    RECORD_TEMPLATE_CREATED,
    RECORD_TEMPLATE_DELETED,
} from "./types";

export * from "./types";

export interface CatalogPurgedPayload {
    id: string;
}

export interface LoadRecordPayload {
    catalog_id?: string;
    record_id: string;
}

export interface LoadArchivedRecordsPayload {
    catalog_id: string;
}

export interface CreateRecordTemplatePayload {
    catalog_id: string;
    params: {
        name: string;
        description: string;
        fields: { name: string; type: string }[];
    };
}

export interface RecordTemplateDeletedPayload {
    id: string;
    catalog_id: string;
}

export interface DeleteRecordTemplatePayload {
    catalog_id: string;
    template_id: string;
}

export interface ArchiveCatalogPayload {
    catalog_id: string;
    space_id: string;
}

export interface UnarchiveCatalogPayload {
    catalog_id: string;
    space_id: string;
}

export interface CatalogFilterPayload {
    catalog_id: string;
    filter: string;
    value: string | string[];
}

export interface CatalogConnectedPayload {
    id: string;
    topic: string;
    channel: Channel;
}

export interface LoadSpaceCatalogsPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface LoadCatalogPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface LoadMetadata {
    root_id: string;
    type: string;
}

export interface CatalogCollectionsLoadedPayload {
    catalog_id: string;
    collections: NormalizedCollection[];
}

export interface CatalogRecordsLoadedPayload {
    catalog_id: string;
    records: NormalizedRecord[];
}

export interface AssignChecklistPayload {
    field_id: string;
    record_id: string;
    user_id: string;
}

export interface RecordMovedPayload {
    id: string;
    index: number;
    collection_id: string;
}

export interface CollectionMovedPayload {
    id: string;
    index: number;
}

export interface UnassignChecklistPayload {
    field_id: string;
    record_id: string;
    user_id: string;
}

export interface ChecklistAssignedPayload {
    field_id: string;
    record_id: string;
    user_id: string;
}

export interface ChecklistUnassignedPayload {
    field_id: string;
    record_id: string;
    user_id: string;
}

export interface RecordFieldMovedPayload {
    id: string;
    record_id: string;
    index: number;
}

export interface RecordFieldValueCreatedPayload extends io.RecordFieldValue {
    [key: string]: any;
}

export interface RecordFieldValueUpdatedPayload extends io.RecordFieldValue {
    [key: string]: any;
}

export interface RecordFieldValueDeletedPayload {
    id: string;
    record_id: string;
    field_id: string;
}

export interface RecordFieldDeletedPayload {
    id: string;
    record_id: string;
}

export interface SetRecordFieldValuePayload<T = any> {
    record_id: string;
    field_id: string;
    params: {
        value: T;
    };
}

export interface CreateRecordFieldValuePayload<T = { [key: string]: any }> {
    record_id: string;
    field_id: string;
    params: T;
}

export interface UpdateRecordFieldValuePayload<T = { [key: string]: any }> {
    record_id: string;
    value_id: string;
    field_id: string;
    params: T;
}

export interface DeleteRecordFieldValuePayload {
    record_id: string;
    field_id: string;
    value_id: string;
}

export interface CreateRecordFieldPayload {
    catalog_id: string;
    record_id: string;
    params: {
        type: string;
        name: string;
        metadata?: { [key: string]: any };
        [key: string]: any;
    };
}

export interface UpdateRecordFieldPayload {
    record_id: string;
    catalog_id?: string;
    field_id: string;
    params: {
        name?: string;
    };
}

export interface DeleteRecordFieldPayload {
    record_id: string;
    field_id: string;
}

export interface MoveRecordFieldPayload {
    record_id: string;
    field_id: string;
    params: {
        index: number;
    };
}

export interface DeleteRecordFieldPayload {
    record_id: string;
    field_id: string;
}

export interface CreateCatalogPayload {
    space_id: string;
    params: {
        name: string;
    };
}

export interface DeleteCatalogPayload {
    catalog_id: string;
    space_id: string;
}

export interface CatalogDeletedPayload {
    id: string;
    space_id: string;
}

export interface UpdateCatalogPayload {
    catalog_id: string;
    space_id: string;
    params: {
        name?: string;
    };
}

export interface GetRecordPayload {
    catalog_id: string;
    record_id?: string;
}

export interface ClearRecordPayload {
    id: string;
    thread_id: string;
    collection_id: string | null;
    catalog_id: string;
}

export interface CreateCollectionPayload {
    name: string;
    origin: boolean;
    capacity: number;
    catalog_id: string;
    type: "stack" | "queue";
}

export interface UpdateCollectionPayload {
    name?: string;
    origin?: boolean;
    collection_id: string;
    catalog_id: string;
    capacity?: number;
    type?: "stack" | "queue";
}

export interface MoveCollectionPayload {
    index: number;
    collection_id: string;
    catalog_id: string;
}

export interface ArchiveCollectionPayload {
    collection_id: string;
    catalog_id: string;
}

export interface UnarchiveCollectionPayload {
    collection_id: string;
    catalog_id: string;
}

export interface DeleteCollectionPayload {
    catalog_id: string;
    collection_id: string;
}

export interface FetchRecordsPayload {
    catalog_id: string;
    collection_id?: string;
}

export interface FetchCollectionsPayload {
    catalog_id: string;
}

export interface MoveRecordPayload {
    record_id: string;
    index?: number;
    collection_id: string;
    catalog_id: string;
}

export interface RecordPosition {
    id: string;
    index: number;
    collection_id: string;
}

export interface DeleteRecordPayload {
    catalog_id: string;
    record_id: string;
}

export interface CollectionPosition {
    id: string;
    index: number;
}

export interface UpdateRecordPayload {
    params: {
        name: string;
    };
    record_id: string;
    catalog_id: string;
}

export interface CreateRecordPayload {
    params: {
        name: string;
    };
    catalog_id: string;
    collection_id: string;
    template_id?: string;
}

export interface ArchiveRecordPayload {
    record_id: string;
    catalog_id: string;
}

export interface CheckRecordPayload {
    record_id: string;
    catalog_id: string;
}

export interface UncheckRecordPayload {
    record_id: string;
    catalog_id: string;
}

export interface CreateChecklistPayload {
    name: string;
    record_id: string;
    user_id: string;
    catalog_id: string;
}

export interface UpdateChecklistPayload {
    name: string;
    catalog_id: string;
    checklist_id: string;
}

export interface ReassignChecklistPayload {
    user_id: string;
    catalog_id: string;
    checklist_id: string;
}

export interface DeleteChecklistPayload {
    record_id: string;
    catalog_id: string;
    checklist_id: string;
}

export interface LoadCollectionsPayload {
    catalog_id: string;
}

export interface LoadRecordsPayload {
    catalog_id: string;
}

export interface CreateLabelParams {
    name: string;
    color: string;
}

export interface CreateLabelPayload {
    catalog_id: string;
    params: CreateLabelParams;
}

export interface DeleteLabelPayload {
    catalog_id: string;
    label_id: string;
}

export interface UpdateLabelPayload {
    catalog_id: string;
    label_id: string;
    params: {
        name?: string;
        color?: string;
    };
}

export interface RemoveChecklistPayload extends Unique { }

export type CatalogPartial = Require<Partial<io.Catalog>, "id" | "space_id">;

export type RecordUnlabeledPayload = Require<
    Partial<io.RecordLabel>,
    "record_id" | "label_id"
>;

export type ChecklistDeletedPayload = Require<
    Partial<io.Checklist>,
    "id" | "record_id"
>;

export interface UnarchiveCollectionPayload extends ArchiveCollectionPayload { }

export type RemoveLabelPayload = Require<Partial<io.Label>, "id" | "catalog_id">;

export type RemoveLabelsPayload = RemoveLabelPayload[];

export type CatalogArchivedAction = Action<CATALOG_ARCHIVED, CatalogPartial>;

export type CatalogUnarchivedAction = Action<CATALOG_UNARCHIVED, CatalogPartial>;

export type CatalogPurgedAction = Action<CATALOG_PURGED, CatalogPurgedPayload>;

export type CatalogFilterUpdatedAction = Action<
    CATALOG_FILTER_UPDATED,
    CatalogFilterPayload
>;

export type LoadRecordAction = IOAction<LOAD_RECORD, LoadRecordPayload, io.Record>;

export type CreateRecordTemplateAction = IOAction<
    CREATE_RECORD_TEMPLATE,
    CreateRecordTemplatePayload,
    io.RecordTemplate
>;

export type LoadArchivedRecordsAction = IOAction<
    LOAD_ARCHIVED_RECORDS,
    LoadArchivedRecordsPayload,
    io.Record[]
>;

export type DeleteRecordTemplateAction = IOAction<
    DELETE_RECORD_TEMPLATE,
    DeleteRecordTemplatePayload,
    any
>;

export type RecordTemplateCreatedAction = Action<
    RECORD_TEMPLATE_CREATED,
    io.RecordTemplate
>;

export type RecordTemplateDeletedAction = Action<
    RECORD_TEMPLATE_DELETED,
    RecordTemplateDeletedPayload
>;

export type CatalogConnectedAction = Action<
    CATALOG_CONNECTED,
    CatalogConnectedPayload
>;

export type RecordFieldValueCreatedAction = Action<
    RECORD_FIELD_VALUE_CREATED,
    RecordFieldValueCreatedPayload
>;

export type RecordFieldValueUpdatedAction = Action<
    RECORD_FIELD_VALUE_UPDATED,
    RecordFieldValueUpdatedPayload
>;

export type RecordFieldValueDeletedAction = Action<
    RECORD_FIELD_VALUE_DELETED,
    RecordFieldValueDeletedPayload
>;

export type LabelCreatedAction = Action<LABEL_CREATED, io.Label>;
export type LabelDeletedAction = Action<LABEL_DELETED, Unique & BelongsToSpace>;
export type LabelLoadedAction = Action<LABEL_LOADED, io.Label>;
export type LabelsLoadedAction = Action<LABELS_LOADED, io.Label[]>;
export type CatalogLabelUpdated = Action<LABEL_UPDATED, io.Label>;

export type ArchiveCatalogAction = IOAction<
    ARCHIVE_CATALOG,
    ArchiveCatalogPayload,
    io.Catalog
>;

export type UnarchiveCatalogAction = IOAction<
    UNARCHIVE_CATALOG,
    UnarchiveCatalogPayload,
    io.Catalog
>;

export type LoadCatalogAction = IOAction<LOAD_CATALOG, LoadCatalogPayload, io.Catalog>;

export type LoadSpaceCatalogsAction = IOAction<
    LOAD_CATALOGS,
    LoadSpaceCatalogsPayload,
    io.Catalog[]
>;

export type CreateLabelAction = IOAction<
    CREATE_LABEL,
    CreateLabelPayload,
    io.Label
>;

export type UpdateLabelAction = IOAction<
    UPDATE_LABEL,
    UpdateLabelPayload,
    io.Label
>;

export type DeleteLabelAction = IOAction<DELETE_LABEL, DeleteLabelPayload, any>;

export type CatalogLoadedAction = Action<CATALOG_LOADED, io.Catalog>;

export type CatalogsLoadedAction = Action<CATALOGS_LOADED, io.Catalog[]>;

export type CatalogCreatedAction = Action<CATALOG_CREATED, io.Catalog>;

export type UpdateCatalogAction = IOAction<
    UPDATE_CATALOG,
    UpdateCatalogPayload,
    io.Catalog
>;

export type AssignChecklistAction = IOAction<
    ASSIGN_CHECKLIST,
    AssignChecklistPayload,
    any
>;

export type UnassignChecklistAction = IOAction<
    UNASSIGN_CHECKLIST,
    UnassignChecklistPayload,
    any
>;

export type CreateRecordFieldAction = IOAction<
    CREATE_RECORD_FIELD,
    CreateRecordFieldPayload,
    io.RecordField
>;

export type MoveRecordFieldAction = IOAction<
    MOVE_RECORD_FIELD,
    MoveRecordFieldPayload,
    any
>;

export type UpdateRecordFieldAction = IOAction<
    UPDATE_RECORD_FIELD,
    UpdateRecordFieldPayload,
    io.RecordField
>;

export type SetRecordFieldValueAction = IOAction<
    SET_RECORD_FIELD,
    SetRecordFieldValuePayload,
    io.RecordField
>;

export type CreateRecordFieldValueAction = IOAction<
    CREATE_RECORD_FIELD_VALUE,
    CreateRecordFieldValuePayload,
    io.RecordField
>;

export type UpdateRecordFieldValueAction = IOAction<
    UPDATE_RECORD_FIELD_VALUE,
    UpdateRecordFieldValuePayload,
    io.RecordField
>;

export type DeleteRecordFieldValueAction = IOAction<
    DELETE_RECORD_FIELD_VALUE,
    DeleteRecordFieldValuePayload,
    io.RecordField
>;

export type DeleteRecordFieldAction = IOAction<
    DELETE_RECORD_FIELD,
    DeleteRecordFieldPayload,
    any
>;

export type ChecklistAssignedAction = Action<
    CHECKLIST_ASSIGNED,
    ChecklistAssignedPayload
>;

export type ChecklistUnassignedAction = Action<
    CHECKLIST_UNASSIGNED,
    ChecklistUnassignedPayload
>;

export type RecordFieldUpdatedAction = Action<
    RECORD_FIELD_UPDATED,
    Partial<io.RecordField>
>;

export type RecordFieldDeletedAction = Action<
    RECORD_FIELD_DELETED,
    { id: string; record_id: string }
>;

export type RecordFieldMovedAction = Action<
    RECORD_FIELD_MOVED,
    RecordFieldMovedPayload
>;

export type LoadRecordsAction = IOAction<
    LOAD_RECORDS,
    LoadRecordsPayload,
    io.Record[],
    LoadMetadata
>;

export type StoreRecordAction = Action<STORE_RECORD, io.Record>;

export type StoreRecordsAction = Action<STORE_RECORDS, io.Record[]>;

export type RecordCreatedAction = Action<RECORD_CREATED, io.Record>;

export type RecordLabeledAction = Action<RECORD_LABELED, io.RecordLabel>;

export type RecordUnlabeledAction = Action<RECORD_UNLABELED, RecordUnlabeledPayload>;

export type RecordDeletedAction = Action<RECORD_DELETED, Unique>;

export type RecordUpdatedAction = Action<RECORD_UPDATED, NormalizedRecord>;

export type RecordLoadedAction = Action<
    RECORD_LOADED,
    NormalizedRecord,
    LoadMetadata
>;

export type RecordsLoadedAction = Action<
    RECORDS_LOADED,
    NormalizedRecord[],
    LoadMetadata
>;

export type CatalogRecordsLoadedAction = Action<
    CATALOG_RECORDS_LOADED,
    CatalogRecordsLoadedPayload
>;

export type RecordsUpdatedAction = Action<RECORDS_UPDATED, NormalizedRecord[]>;

export type RecordsReorderedAction = Action<RECORDS_REORDERED, RecordPosition[]>;

export type CheckRecordAction = IOAction<
    CHECK_RECORD,
    CheckRecordPayload,
    Partial<io.Record>
>;

export type UncheckRecordAction = IOAction<
    UNCHECK_RECORD,
    CheckRecordPayload,
    Partial<io.Record>
>;

export type DeleteRecordAction = IOAction<
    DELETE_RECORD,
    DeleteRecordPayload,
    Partial<io.Record>
>;

export type MoveRecordAction = IOAction<MOVE_RECORD, MoveRecordPayload, RecordPosition>;

export type FetchRecordsAction = IOAction<
    FETCH_RECORDS,
    FetchRecordsPayload,
    io.Record[]
>;

export type FetchCollectionsAction = IOAction<
    FETCH_COLLECTIONS,
    FetchCollectionsPayload,
    io.Collection[]
>;

export type GetRecordAction = IOAction<GET_RECORD, GetRecordPayload, io.Record>;

export type CreateRecordAction = IOAction<
    CREATE_RECORD,
    CreateRecordPayload,
    io.Record
>;

export type UpdateRecordAction = IOAction<
    UPDATE_RECORD,
    UpdateRecordPayload,
    io.Record
>;

export type ArchiveRecordAction = IOAction<
    ARCHIVE_RECORD,
    ArchiveRecordPayload,
    io.Record
>;

export type RecordArchivedAction = Action<RECORD_ARCHIVED, io.Record>;

export type RecordUnarchivedAction = Action<RECORD_UNARCHIVED, io.Record>;

export type CollectionCreatedAction = Action<COLLECTION_CREATED, io.Collection>;

export type CollectionDeletedAction = Action<
    COLLECTION_DELETED,
    Unique & { catalog_id: string }
>;

export type CollectionUpdatedAction = Action<COLLECTION_UPDATED, NormalizedCollection>;

export type CollectionsUpdatedAction = Action<COLLECTIONS_UPDATED, NormalizedCollection[]>;

export type CollectionArchivedAction = Action<COLLECTION_ARCHIVED, io.Collection>;

export type CollectionUnarchivedAction = Action<COLLECTION_UNARCHIVED, io.Collection>;

export type StoreCollectionsAction = Action<STORE_COLLECTIONS, io.Collection[]>;

export type CollectionLoadedAction = Action<
    COLLECTION_LOADED,
    NormalizedCollection,
    LoadMetadata
>;

export type CollectionsLoadedAction = Action<
    COLLECTIONS_LOADED,
    NormalizedCollection[],
    LoadMetadata
>;

export type CatalogCollectionsLoadedAction = Action<
    CATALOG_COLLECTIONS_LOADED,
    CatalogCollectionsLoadedPayload
>;

export type CollectionsReorderedAction = Action<COLLECTIONS_REORDERED, RecordPosition[]>;

export type LoadCollectionsAction = IOAction<
    LOAD_COLLECTIONS,
    LoadCollectionsPayload,
    io.Collection[],
    LoadMetadata
>;

export type CreateCollectionAction = IOAction<
    CREATE_COLLECTION,
    CreateCollectionPayload,
    io.Collection
>;

export type DeleteCollectionAction = IOAction<
    DELETE_COLLECTION,
    DeleteCollectionPayload,
    any
>;

export type UpdateCollectionAction = IOAction<
    UPDATE_COLLECTION,
    UpdateCollectionPayload,
    io.Collection
>;

export type MoveCollectionAction = IOAction<
    MOVE_COLLECTION,
    MoveCollectionPayload,
    CollectionPosition
>;

export type ArchiveCollectionAction = IOAction<
    ARCHIVE_COLLECTION,
    ArchiveCollectionPayload,
    io.Collection
>;

export type UnarchiveCollectionAction = IOAction<
    UNARCHIVE_COLLECTION,
    ArchiveCollectionPayload,
    io.Collection
>;

export type CreateCatalogAction = IOAction<
    CREATE_CATALOG,
    CreateCatalogPayload,
    io.Catalog
>;

export type RecordMovedAction = Action<RECORD_MOVED, RecordMovedPayload>;

export type CollectionMovedAction = Action<COLLECTION_MOVED, CollectionMovedPayload>;

export type DeleteCatalogAction = IOAction<DELETE_CATALOG, DeleteCatalogPayload, any>;

export type CatalogDeletedAction = Action<CATALOG_DELETED, CatalogDeletedPayload>;

export type CatalogUpdatedAction = Action<CATALOG_UPDATED, CatalogPartial>;

export type RecordFieldCreatedAction = Action<RECORD_FIELD_CREATED, io.RecordField>;

export function fetchCollections(payload: FetchCollectionsPayload): FetchCollectionsAction {
    return createIOAction<FETCH_COLLECTIONS>(FETCH_COLLECTIONS, payload);
}

export function loadRecord(payload: LoadRecordPayload): LoadRecordAction {
    return createIOAction<LOAD_RECORD>(LOAD_RECORD, payload);
}

export function loadCatalogRecords(payload: LoadRecordsPayload): LoadRecordsAction {
    let metadata: LoadMetadata = {
        root_id: payload.catalog_id,
        type: "catalog",
    };
    return createIOAction<LOAD_RECORDS>(LOAD_RECORDS, payload, metadata);
}

export function loadCatalogCollections(
    payload: LoadCollectionsPayload
): LoadCollectionsAction {
    let metadata: LoadMetadata = {
        root_id: payload.catalog_id,
        type: "catalog",
    };
    return createIOAction<LOAD_COLLECTIONS>(LOAD_COLLECTIONS, payload, metadata);
}

export function getRecord(payload: GetRecordPayload): GetRecordAction {
    return createIOAction<GET_RECORD>(GET_RECORD, payload);
}

export function fetchRecords(payload: FetchRecordsPayload): FetchRecordsAction {
    return createIOAction<FETCH_RECORDS>(FETCH_RECORDS, payload);
}

export function checkRecord(payload: CheckRecordPayload): CheckRecordAction {
    return createIOAction<CHECK_RECORD>(CHECK_RECORD, payload);
}

export function uncheckRecord(
    payload: UncheckRecordPayload
): UncheckRecordAction {
    return createIOAction<UNCHECK_RECORD>(UNCHECK_RECORD, payload);
}

export function recordArchived(record: io.Record): RecordArchivedAction {
    return createAction(RECORD_ARCHIVED, record);
}

export function recordUnarchived(record: io.Record): RecordUnarchivedAction {
    return createAction(RECORD_UNARCHIVED, record);
}

export function storeRecord(record: io.Record): StoreRecordAction {
    return createAction(STORE_RECORD, record);
}

export function storeRecords(records: io.Record[]): StoreRecordsAction {
    return createAction(STORE_RECORDS, records);
}

export function recordCreated(record: io.Record): RecordCreatedAction {
    return createAction(RECORD_CREATED, record);
}

export function recordDeleted(id: string): RecordDeletedAction {
    return createAction(RECORD_DELETED, { id });
}

export function recordsUpdated(records: NormalizedRecord[]): RecordsUpdatedAction {
    return createAction(RECORDS_UPDATED, records);
}

export function recordLoaded(
    record: NormalizedRecord,
    metadata?: LoadMetadata
): RecordLoadedAction {
    return createAction(RECORD_LOADED, record, metadata);
}

export function recordsLoaded(
    records: NormalizedRecord[],
    metadata?: LoadMetadata
): RecordsLoadedAction {
    return createAction(RECORDS_LOADED, records, metadata);
}

export function moveRecord(payload: MoveRecordPayload): MoveRecordAction {
    return createIOAction<MOVE_RECORD>(MOVE_RECORD, payload);
}

export function updateRecord(payload: UpdateRecordPayload): UpdateRecordAction {
    return createIOAction<UPDATE_RECORD>(UPDATE_RECORD, payload);
}

export function recordUpdated(payload: NormalizedRecord): RecordUpdatedAction {
    return createAction(RECORD_UPDATED, payload);
}

export function createRecord(payload: CreateRecordPayload): CreateRecordAction {
    return createIOAction<CREATE_RECORD>(CREATE_RECORD, payload);
}

export function recordsReordered(payload: RecordPosition[]): RecordsReorderedAction {
    return createAction(RECORDS_REORDERED, payload);
}

export function archiveRecord(payload: ArchiveRecordPayload): ArchiveRecordAction {
    return createIOAction<ARCHIVE_RECORD>(ARCHIVE_RECORD, payload);
}

export function delelteRecord(payload: DeleteRecordPayload): DeleteRecordAction {
    return createIOAction<DELETE_RECORD>(DELETE_RECORD, payload);
}

export function collectionDeleted(
    collection: Unique & BelongsToCatalog
): CollectionDeletedAction {
    return createAction(COLLECTION_DELETED, collection);
}

export function collectionUnarchived(collection: io.Collection): CollectionUnarchivedAction {
    return createAction(COLLECTION_UNARCHIVED, collection);
}

export function collectionArchived(collection: io.Collection): CollectionArchivedAction {
    return createAction(COLLECTION_ARCHIVED, collection);
}

export function collectionCreated(collection: io.Collection): CollectionCreatedAction {
    return createAction(COLLECTION_CREATED, collection);
}

export function collectionLoaded(
    collection: NormalizedCollection,
    metadata?: LoadMetadata
): CollectionLoadedAction {
    return createAction(COLLECTION_LOADED, collection, metadata);
}

export function collectionsLoaded(
    collections: NormalizedCollection[],
    metadata?: LoadMetadata
): CollectionsLoadedAction {
    return createAction(COLLECTIONS_LOADED, collections, metadata);
}

export function moveCollection(payload: MoveCollectionPayload): MoveCollectionAction {
    return createIOAction<MOVE_COLLECTION>(MOVE_COLLECTION, payload);
}

export function updateCollection(payload: UpdateCollectionPayload): UpdateCollectionAction {
    return createIOAction<UPDATE_COLLECTION>(UPDATE_COLLECTION, payload);
}

export function deleteCollection(payload: DeleteCollectionPayload): DeleteCollectionAction {
    return createIOAction<DELETE_COLLECTION>(DELETE_COLLECTION, payload);
}

export function collectionUpdated(payload: NormalizedCollection): CollectionUpdatedAction {
    return createAction(COLLECTION_UPDATED, payload);
}

export function collectionsUpdated(
    payload: NormalizedCollection[]
): CollectionsUpdatedAction {
    return createAction(COLLECTIONS_UPDATED, payload);
}

export function createCollection(payload: CreateCollectionPayload): CreateCollectionAction {
    return createIOAction<CREATE_COLLECTION>(CREATE_COLLECTION, payload);
}

export function storeCollections(payload: io.Collection[]): StoreCollectionsAction {
    return createAction<STORE_COLLECTIONS>(STORE_COLLECTIONS, payload);
}

export function collectionsReordered(
    payload: CollectionPosition[]
): CollectionsReorderedAction {
    return createAction<COLLECTIONS_REORDERED>(COLLECTIONS_REORDERED, payload);
}

export function archiveCollection(
    payload: ArchiveCollectionPayload
): ArchiveCollectionAction {
    return createIOAction<ARCHIVE_COLLECTION>(ARCHIVE_COLLECTION, payload);
}

export function unarchiveCollection(
    payload: UnarchiveCollectionPayload
): UnarchiveCollectionAction {
    return createIOAction<UNARCHIVE_COLLECTION>(UNARCHIVE_COLLECTION, payload);
}

// Label

export function createLabel(
    id: string,
    params: CreateLabelParams
): CreateLabelAction {
    return createIOAction<CREATE_LABEL>(CREATE_LABEL, { catalog_id: id, params });
}

export function updateLabel(payload: UpdateLabelPayload): UpdateLabelAction {
    return createIOAction<UPDATE_LABEL>(UPDATE_LABEL, payload);
}

export function deleteLabel(payload: DeleteLabelPayload): DeleteLabelAction {
    return createIOAction<DELETE_LABEL>(DELETE_LABEL, payload);
}

export function labelCreated(label: io.Label): LabelCreatedAction {
    return createAction(LABEL_CREATED, label);
}

export function labelDeleted(
    label: Unique & BelongsToSpace
): LabelDeletedAction {
    return createAction(LABEL_DELETED, label);
}

export function catalogLabelUpdated(label: io.Label): CatalogLabelUpdated {
    return createAction(LABEL_UPDATED, label);
}

export function labelLoaded(label: io.Label): LabelLoadedAction {
    return createAction(LABEL_LOADED, label);
}

export function labelsLoaded(label: io.Label[]): LabelsLoadedAction {
    return createAction(LABELS_LOADED, label);
}

// Catalog
export function catalogLoaded(payload: io.Catalog): CatalogLoadedAction {
    return createAction(CATALOG_LOADED, payload);
}

export function catalogsLoaded(payload: io.Catalog[]): CatalogsLoadedAction {
    return createAction(CATALOGS_LOADED, payload);
}

export function catalogUpdated(payload: CatalogPartial): CatalogUpdatedAction {
    return createAction(CATALOG_UPDATED, payload);
}

export function catalogDeleted(payload: CatalogDeletedPayload): CatalogDeletedAction {
    return createAction(CATALOG_DELETED, payload);
}

export function updateCatalog(payload: UpdateCatalogPayload): UpdateCatalogAction {
    return createIOAction<UPDATE_CATALOG>(UPDATE_CATALOG, payload);
}

export function createCatalog(payload: CreateCatalogPayload): CreateCatalogAction {
    return createIOAction<CREATE_CATALOG>(CREATE_CATALOG, payload);
}

export function deleteCatalog(payload: DeleteCatalogPayload): DeleteCatalogAction {
    return createIOAction<DELETE_CATALOG>(DELETE_CATALOG, payload);
}

// Record Field
export function createRecordField(
    payload: CreateRecordFieldPayload
): CreateRecordFieldAction {
    return createIOAction<CREATE_RECORD_FIELD>(CREATE_RECORD_FIELD, payload);
}

export function updateRecordField(
    payload: UpdateRecordFieldPayload
): UpdateRecordFieldAction {
    return createIOAction<UPDATE_RECORD_FIELD>(UPDATE_RECORD_FIELD, payload);
}

export function deleteRecordField(
    payload: DeleteRecordFieldPayload
): DeleteRecordFieldAction {
    return createIOAction<DELETE_RECORD_FIELD>(DELETE_RECORD_FIELD, payload);
}

export function recordFieldCreated(
    payload: io.RecordField
): RecordFieldCreatedAction {
    return createAction(RECORD_FIELD_CREATED, payload);
}

export function recordFieldUpdated(
    payload: io.RecordField
): RecordFieldUpdatedAction {
    return createAction(RECORD_FIELD_UPDATED, payload);
}

export function recordFieldDeleted(
    payload: RecordFieldDeletedPayload
): RecordFieldDeletedAction {
    return createAction(RECORD_FIELD_DELETED, payload);
}

export function setRecordFieldValue(
    payload: SetRecordFieldValuePayload
): SetRecordFieldValueAction {
    return createIOAction<SET_RECORD_FIELD>(SET_RECORD_FIELD, payload);
}

export function createRecordFieldValue(
    payload: CreateRecordFieldValuePayload
): CreateRecordFieldValueAction {
    return createIOAction<CREATE_RECORD_FIELD_VALUE>(
        CREATE_RECORD_FIELD_VALUE,
        payload
    );
}

export function updateRecordFieldValue(
    payload: UpdateRecordFieldValuePayload
): UpdateRecordFieldValueAction {
    return createIOAction<UPDATE_RECORD_FIELD_VALUE>(
        UPDATE_RECORD_FIELD_VALUE,
        payload
    );
}

export function moveRecordField(
    payload: MoveRecordFieldPayload
): MoveRecordFieldAction {
    return createIOAction<MOVE_RECORD_FIELD>(MOVE_RECORD_FIELD, payload);
}

export function deleteRecordFieldValue(
    payload: DeleteRecordFieldValuePayload
): DeleteRecordFieldValueAction {
    return createIOAction<DELETE_RECORD_FIELD_VALUE>(
        DELETE_RECORD_FIELD_VALUE,
        payload
    );
}

export function recordFieldValueCreated(
    payload: RecordFieldValueCreatedPayload
): RecordFieldValueCreatedAction {
    return createAction(RECORD_FIELD_VALUE_CREATED, payload);
}

export function recordFieldMoved(
    payload: RecordFieldMovedPayload
): RecordFieldMovedAction {
    return createAction(RECORD_FIELD_MOVED, payload);
}

export function recordFieldValueUpdated(
    payload: RecordFieldValueUpdatedPayload
): RecordFieldValueUpdatedAction {
    return createAction(RECORD_FIELD_VALUE_UPDATED, payload);
}

export function recordFieldValueDeleted(
    payload: RecordFieldValueDeletedPayload
): RecordFieldValueDeletedAction {
    return createAction(RECORD_FIELD_VALUE_DELETED, payload);
}

export function assignChecklist(
    payload: AssignChecklistPayload
): AssignChecklistAction {
    return createIOAction<ASSIGN_CHECKLIST, AssignChecklistPayload>(
        ASSIGN_CHECKLIST,
        payload
    );
}

export function unassignChecklist(
    payload: UnassignChecklistPayload
): UnassignChecklistAction {
    return createIOAction<UNASSIGN_CHECKLIST, UnassignChecklistPayload>(
        UNASSIGN_CHECKLIST,
        payload
    );
}

export function checklistAssigned(payload: ChecklistAssignedPayload) {
    return createAction(CHECKLIST_ASSIGNED, payload);
}

export function checklistUnassigned(payload: ChecklistUnassignedPayload) {
    return createAction(CHECKLIST_UNASSIGNED, payload);
}

export function recordMoved(payload: RecordMovedPayload): RecordMovedAction {
    return createAction(RECORD_MOVED, payload);
}

export function collectionMoved(payload: CollectionMovedPayload): CollectionMovedAction {
    return createAction(COLLECTION_MOVED, payload);
}

export function catalogRecordsLoaded(
    payload: CatalogRecordsLoadedPayload
): CatalogRecordsLoadedAction {
    return createAction(CATALOG_RECORDS_LOADED, payload);
}

export function catalogConnected(
    payload: CatalogConnectedPayload
): CatalogConnectedAction {
    return createAction(CATALOG_CONNECTED, payload);
}

export function catalogCreated(payload: io.Catalog): CatalogCreatedAction {
    return createAction(CATALOG_CREATED, payload);
}

export function catalogCollectionsLoaded(
    payload: CatalogCollectionsLoadedPayload
): CatalogCollectionsLoadedAction {
    return createAction(CATALOG_COLLECTIONS_LOADED, payload);
}

export function updateCatalogFilter(
    payload: CatalogFilterPayload
): CatalogFilterUpdatedAction {
    return createAction(CATALOG_FILTER_UPDATED, payload);
}
export function loadCatalog(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadCatalogAction {
    return createIOAction<LOAD_CATALOG>(LOAD_CATALOG, { id, params });
}

export function loadSpaceCatalogs(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadSpaceCatalogsAction {
    return createIOAction<LOAD_CATALOGS>(LOAD_CATALOGS, { id, params });
}

export function archiveCatalog(payload: ArchiveCatalogPayload): ArchiveCatalogAction {
    return createIOAction<ARCHIVE_CATALOG>(ARCHIVE_CATALOG, payload);
}

export function unarchiveCatalog(
    payload: UnarchiveCatalogPayload
): UnarchiveCatalogAction {
    return createIOAction<UNARCHIVE_CATALOG>(UNARCHIVE_CATALOG, payload);
}

export function catalogArchived(payload: CatalogPartial): CatalogArchivedAction {
    return createAction(CATALOG_ARCHIVED, payload);
}

export function catalogUnarchived(payload: CatalogPartial): CatalogUnarchivedAction {
    return createAction(CATALOG_UNARCHIVED, payload);
}

export function purgeCatalog(payload: CatalogPurgedPayload): CatalogPurgedAction {
    return createAction(CATALOG_PURGED, payload);
}

export function recordTemplateCreated(
    payload: io.RecordTemplate
): RecordTemplateCreatedAction {
    return createAction(RECORD_TEMPLATE_CREATED, payload);
}
export function recordTemplateDeleted(
    payload: RecordTemplateDeletedPayload
): RecordTemplateDeletedAction {
    return createAction(RECORD_TEMPLATE_DELETED, payload);
}

export function createRecordTemplate(
    payload: CreateRecordTemplatePayload
): CreateRecordTemplateAction {
    return createIOAction<CREATE_RECORD_TEMPLATE>(CREATE_RECORD_TEMPLATE, payload);
}

export function deleteRecordTemplate(
    payload: DeleteRecordTemplatePayload
): DeleteRecordTemplateAction {
    return createIOAction<DELETE_RECORD_TEMPLATE>(DELETE_RECORD_TEMPLATE, payload);
}

export function loadArchivedRecords(
    payload: LoadArchivedRecordsPayload
): LoadArchivedRecordsAction {
    return createIOAction<LOAD_ARCHIVED_RECORDS>(LOAD_ARCHIVED_RECORDS, payload);
}
