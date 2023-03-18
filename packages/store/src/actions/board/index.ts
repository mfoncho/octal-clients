import type { io, Unique, BelongsToSpace } from "@colab/client";
import type { Channel } from "@colab/endpoint";
import type { Require } from "@colab/common";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedCard, NormalizedCollection } from "../../schemas";
import {
    BOARD_PURGED,
    LOAD_ARCHIVED_CARDS,
    BOARD_FILTER_UPDATED,
    BOARD_CONNECTED,
    BOARD_COLLECTIONS_LOADED,
    BOARD_CARDS_LOADED,
    COLLECTIONS_UPDATED,
    CARDS_UPDATED,
    LABEL_DELETED,
    LABEL_CREATED,
    CREATE_LABEL,
    DELETE_LABEL,
    UPDATE_LABEL,
    LABEL_LOADED,
    LABELS_LOADED,
    MOVE_CARD,
    ARCHIVE_COLLECTION,
    STORE_COLLECTIONS,
    UNARCHIVE_COLLECTION,
    MOVE_COLLECTION,
    UPDATE_COLLECTION,
    CREATE_CARD,
    UPDATE_CARD,
    CARDS_REORDERED,
    STORE_CARD,
    STORE_CARDS,
    CARD_LOADED,
    CARDS_LOADED,
    CARD_UPDATED,
    CARD_DELETED,
    COLLECTION_DELETED,
    CREATE_COLLECTION,
    FETCH_CARDS,
    COLLECTION_LOADED,
    COLLECTIONS_LOADED,
    COLLECTIONS_REORDERED,
    COLLECTION_UPDATED,
    ARCHIVE_CARD,
    CARD_CREATED,
    COLLECTION_CREATED,
    COLLECTION_ARCHIVED,
    COLLECTION_UNARCHIVED,
    GET_CARD,
    CARD_LABELED,
    CARD_UNLABELED,
    CARD_ARCHIVED,
    CARD_UNARCHIVED,
    DELETE_CARD,
    CARD_MOVED,
    COMPLETE_CARD,
    UNCOMPLETE_CARD,
    LOAD_CARDS,
    LOAD_CARD,
    LOAD_COLLECTIONS,
    FETCH_COLLECTIONS,
    DELETE_COLLECTION,
    UPDATE_CARD_FIELD,
    COLLECTION_MOVED,
    ASSIGN_CHECKLIST,
    CHECKLIST_ASSIGNED,
    LABEL_UPDATED,
    CREATE_CARD_FIELD,
    DELETE_CARD_FIELD,
    CARD_FIELD_UPDATED,
    CARD_FIELD_DELETED,
    MOVE_CARD_FIELD,
    CARD_FIELD_MOVED,
    CARD_FIELD_CREATED,
    SET_CARD_FIELD,
    DELETE_CARD_FIELD_VALUE,
    CREATE_CARD_FIELD_VALUE,
    UPDATE_CARD_FIELD_VALUE,
    CARD_FIELD_VALUE_DELETED,
    CARD_FIELD_VALUE_UPDATED,
    CARD_FIELD_VALUE_CREATED,
    UNASSIGN_CHECKLIST,
    CHECKLIST_UNASSIGNED,
    CREATE_CARD_TEMPLATE,
    DELETE_CARD_TEMPLATE,
    CARD_TEMPLATE_CREATED,
    CARD_TEMPLATE_DELETED,
} from "./types";

export * from "./types";

export interface BoardPurgedPayload {
    id: string;
}

export interface LoadCardPayload {
    space_id?: string;
    card_id: string;
}

export interface LoadArchivedCardsPayload {
    space_id: string;
}

export interface CreateCardTemplatePayload {
    space_id: string;
    params: {
        name: string;
        description: string;
        fields: { name: string; type: string }[];
    };
}

export interface CardTemplateDeletedPayload {
    id: string;
    space_id: string;
}

export interface DeleteCardTemplatePayload {
    space_id: string;
    template_id: string;
}

export interface BoardFilterPayload {
    space_id: string;
    filter: string;
    value: string | string[];
}

export interface BoardConnectedPayload {
    id: string;
    topic: string;
    channel: Channel;
}

export interface LoadSpaceBoardsPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface LoadBoardPayload {
    id: string;
    params?: {
        [key: string]: string | number;
    };
}

export interface LoadMetadata {
    root_id: string;
    type: string;
}

export interface BoardCollectionsLoadedPayload {
    space_id: string;
    collections: NormalizedCollection[];
}

export interface BoardCardsLoadedPayload {
    space_id: string;
    cards: NormalizedCard[];
}

export interface AssignChecklistPayload {
    field_id: string;
    card_id: string;
    user_id: string;
}

export interface CardMovedPayload {
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
    card_id: string;
    user_id: string;
}

export interface ChecklistAssignedPayload {
    field_id: string;
    card_id: string;
    user_id: string;
}

export interface ChecklistUnassignedPayload {
    field_id: string;
    card_id: string;
    user_id: string;
}

export interface CardFieldMovedPayload {
    id: string;
    card_id: string;
    index: number;
}

export interface CardFieldValueCreatedPayload extends io.CardFieldValue {
    [key: string]: any;
}

export interface CardFieldValueUpdatedPayload extends io.CardFieldValue {
    [key: string]: any;
}

export interface CardFieldValueDeletedPayload {
    id: string;
    card_id: string;
    field_id: string;
}

export interface CardFieldDeletedPayload {
    id: string;
    card_id: string;
}

export interface SetCardFieldValuePayload<T = any> {
    card_id: string;
    field_id: string;
    params: {
        value: T;
    };
}

export interface CreateCardFieldValuePayload<T = { [key: string]: any }> {
    card_id: string;
    field_id: string;
    params: T;
}

export interface UpdateCardFieldValuePayload<T = { [key: string]: any }> {
    card_id: string;
    value_id: string;
    field_id: string;
    params: T;
}

export interface DeleteCardFieldValuePayload {
    card_id: string;
    field_id: string;
    value_id: string;
}

export interface CreateCardFieldPayload {
    space_id: string;
    card_id: string;
    params: {
        type: string;
        name: string;
        metadata?: { [key: string]: any };
        [key: string]: any;
    };
}

export interface UpdateCardFieldPayload {
    card_id: string;
    space_id?: string;
    field_id: string;
    params: {
        name?: string;
    };
}

export interface DeleteCardFieldPayload {
    card_id: string;
    field_id: string;
}

export interface MoveCardFieldPayload {
    card_id: string;
    field_id: string;
    params: {
        index: number;
    };
}

export interface DeleteCardFieldPayload {
    card_id: string;
    field_id: string;
}

export interface GetCardPayload {
    space_id: string;
    card_id?: string;
}

export interface CreateCollectionPayload {
    name: string;
    origin: boolean;
    capacity: number;
    space_id: string;
    type: "stack" | "queue";
}

export interface UpdateCollectionPayload {
    name?: string;
    origin?: boolean;
    collection_id: string;
    space_id: string;
    capacity?: number;
    type?: "stack" | "queue";
}

export interface MoveCollectionPayload {
    index: number;
    collection_id: string;
    space_id: string;
}

export interface ArchiveCollectionPayload {
    collection_id: string;
    space_id: string;
}

export interface UnarchiveCollectionPayload {
    collection_id: string;
    space_id: string;
}

export interface DeleteCollectionPayload {
    space_id: string;
    collection_id: string;
}

export interface FetchCardsPayload {
    space_id: string;
    collection_id?: string;
}

export interface FetchCollectionsPayload {
    space_id: string;
}

export interface MoveCardPayload {
    card_id: string;
    index?: number;
    collection_id: string;
    space_id: string;
}

export interface CardPosition {
    id: string;
    index: number;
    collection_id: string;
}

export interface DeleteCardPayload {
    space_id: string;
    card_id: string;
}

export interface CollectionPosition {
    id: string;
    index: number;
}

export interface UpdateCardPayload {
    params: {
        name: string;
    };
    card_id: string;
    space_id: string;
}

export interface CreateCardPayload {
    params: {
        name: string;
    };
    space_id: string;
    collection_id: string;
    template_id?: string;
}

export interface ArchiveCardPayload {
    card_id: string;
    space_id: string;
}

export interface CompleteCardPayload {
    card_id: string;
    space_id: string;
}

export interface UncompleteCardPayload {
    card_id: string;
    space_id: string;
}

export interface CreateChecklistPayload {
    name: string;
    card_id: string;
    user_id: string;
    space_id: string;
}

export interface UpdateChecklistPayload {
    name: string;
    space_id: string;
    checklist_id: string;
}

export interface ReassignChecklistPayload {
    user_id: string;
    space_id: string;
    checklist_id: string;
}

export interface DeleteChecklistPayload {
    card_id: string;
    space_id: string;
    checklist_id: string;
}

export interface LoadCollectionsPayload {
    space_id: string;
}

export interface LoadCardsPayload {
    space_id: string;
}

export interface CreateLabelParams {
    name: string;
    color: string;
}

export interface CreateLabelPayload {
    space_id: string;
    params: CreateLabelParams;
}

export interface DeleteLabelPayload {
    space_id: string;
    label_id: string;
}

export interface UpdateLabelPayload {
    space_id: string;
    label_id: string;
    params: {
        name?: string;
        color?: string;
    };
}

export interface RemoveChecklistPayload extends Unique {}

export type BoardPartial = Require<Partial<io.Board>, "id" | "space_id">;

export type CardUnlabeledPayload = Require<
    Partial<io.CardLabel>,
    "card_id" | "label_id"
>;

export type ChecklistDeletedPayload = Require<
    Partial<io.Checklist>,
    "id" | "card_id"
>;

export interface UnarchiveCollectionPayload extends ArchiveCollectionPayload {}

export type RemoveLabelPayload = Require<Partial<io.Label>, "id" | "space_id">;

export type RemoveLabelsPayload = RemoveLabelPayload[];

export type BoardPurgedAction = Action<BOARD_PURGED, BoardPurgedPayload>;

export type BoardFilterUpdatedAction = Action<
    BOARD_FILTER_UPDATED,
    BoardFilterPayload
>;

export type CardMovedAction = Action<CARD_MOVED, CardMovedPayload>;

export type LoadCardAction = IOAction<LOAD_CARD, LoadCardPayload, io.Card>;

export type CreateCardTemplateAction = IOAction<
    CREATE_CARD_TEMPLATE,
    CreateCardTemplatePayload,
    io.CardTemplate
>;

export type LoadArchivedCardsAction = IOAction<
    LOAD_ARCHIVED_CARDS,
    LoadArchivedCardsPayload,
    io.Card[]
>;

export type DeleteCardTemplateAction = IOAction<
    DELETE_CARD_TEMPLATE,
    DeleteCardTemplatePayload,
    any
>;

export type CardTemplateCreatedAction = Action<
    CARD_TEMPLATE_CREATED,
    io.CardTemplate
>;

export type CardTemplateDeletedAction = Action<
    CARD_TEMPLATE_DELETED,
    CardTemplateDeletedPayload
>;

export type BoardConnectedAction = Action<
    BOARD_CONNECTED,
    BoardConnectedPayload
>;

export type CardFieldValueCreatedAction = Action<
    CARD_FIELD_VALUE_CREATED,
    CardFieldValueCreatedPayload
>;

export type CardFieldValueUpdatedAction = Action<
    CARD_FIELD_VALUE_UPDATED,
    CardFieldValueUpdatedPayload
>;

export type CardFieldValueDeletedAction = Action<
    CARD_FIELD_VALUE_DELETED,
    CardFieldValueDeletedPayload
>;

export type LabelCreatedAction = Action<LABEL_CREATED, io.Label>;
export type LabelDeletedAction = Action<LABEL_DELETED, Unique & BelongsToSpace>;
export type LabelLoadedAction = Action<LABEL_LOADED, io.Label>;
export type LabelsLoadedAction = Action<LABELS_LOADED, io.Label[]>;
export type BoardLabelUpdated = Action<LABEL_UPDATED, io.Label>;

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

export type CreateCardFieldAction = IOAction<
    CREATE_CARD_FIELD,
    CreateCardFieldPayload,
    io.CardField
>;

export type MoveCardFieldAction = IOAction<
    MOVE_CARD_FIELD,
    MoveCardFieldPayload,
    any
>;

export type UpdateCardFieldAction = IOAction<
    UPDATE_CARD_FIELD,
    UpdateCardFieldPayload,
    io.CardField
>;

export type SetCardFieldValueAction = IOAction<
    SET_CARD_FIELD,
    SetCardFieldValuePayload,
    io.CardField
>;

export type CreateCardFieldValueAction = IOAction<
    CREATE_CARD_FIELD_VALUE,
    CreateCardFieldValuePayload,
    io.CardField
>;

export type UpdateCardFieldValueAction = IOAction<
    UPDATE_CARD_FIELD_VALUE,
    UpdateCardFieldValuePayload,
    io.CardField
>;

export type DeleteCardFieldValueAction = IOAction<
    DELETE_CARD_FIELD_VALUE,
    DeleteCardFieldValuePayload,
    io.CardField
>;

export type DeleteCardFieldAction = IOAction<
    DELETE_CARD_FIELD,
    DeleteCardFieldPayload,
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

export type CardFieldUpdatedAction = Action<
    CARD_FIELD_UPDATED,
    Partial<io.CardField>
>;

export type CardFieldDeletedAction = Action<
    CARD_FIELD_DELETED,
    { id: string; card_id: string }
>;

export type CardFieldMovedAction = Action<
    CARD_FIELD_MOVED,
    CardFieldMovedPayload
>;

export type LoadCardsAction = IOAction<
    LOAD_CARDS,
    LoadCardsPayload,
    io.Card[],
    LoadMetadata
>;

export type StoreCardAction = Action<STORE_CARD, io.Card>;

export type StoreCardsAction = Action<STORE_CARDS, io.Card[]>;

export type CardCreatedAction = Action<CARD_CREATED, io.Card>;

export type CardLabeledAction = Action<CARD_LABELED, io.CardLabel>;

export type CardUnlabeledAction = Action<CARD_UNLABELED, CardUnlabeledPayload>;

export type CardDeletedAction = Action<CARD_DELETED, Unique>;

export type CardUpdatedAction = Action<CARD_UPDATED, NormalizedCard>;

export type CardLoadedAction = Action<
    CARD_LOADED,
    NormalizedCard,
    LoadMetadata
>;

export type CardsLoadedAction = Action<
    CARDS_LOADED,
    NormalizedCard[],
    LoadMetadata
>;

export type BoardCardsLoadedAction = Action<
    BOARD_CARDS_LOADED,
    BoardCardsLoadedPayload
>;

export type CardsUpdatedAction = Action<CARDS_UPDATED, NormalizedCard[]>;

export type CardsReorderedAction = Action<CARDS_REORDERED, CardPosition[]>;

export type CompleteCardAction = IOAction<
    COMPLETE_CARD,
    CompleteCardPayload,
    Partial<io.Card>
>;

export type UncompleteCardAction = IOAction<
    UNCOMPLETE_CARD,
    CompleteCardPayload,
    Partial<io.Card>
>;

export type DeleteCardAction = IOAction<
    DELETE_CARD,
    DeleteCardPayload,
    Partial<io.Card>
>;

export type MoveCardAction = IOAction<MOVE_CARD, MoveCardPayload, CardPosition>;

export type FetchCardsAction = IOAction<
    FETCH_CARDS,
    FetchCardsPayload,
    io.Card[]
>;

export type FetchCollectionsAction = IOAction<
    FETCH_COLLECTIONS,
    FetchCollectionsPayload,
    io.Collection[]
>;

export type GetCardAction = IOAction<GET_CARD, GetCardPayload, io.Card>;

export type CreateCardAction = IOAction<
    CREATE_CARD,
    CreateCardPayload,
    io.Card
>;

export type UpdateCardAction = IOAction<
    UPDATE_CARD,
    UpdateCardPayload,
    io.Card
>;

export type ArchiveCardAction = IOAction<
    ARCHIVE_CARD,
    ArchiveCardPayload,
    io.Card
>;

export type CardArchivedAction = Action<CARD_ARCHIVED, io.Card>;

export type CardUnarchivedAction = Action<CARD_UNARCHIVED, io.Card>;

export type CollectionCreatedAction = Action<COLLECTION_CREATED, io.Collection>;

export type CollectionDeletedAction = Action<
    COLLECTION_DELETED,
    Unique & { space_id: string }
>;

export type CollectionUpdatedAction = Action<
    COLLECTION_UPDATED,
    NormalizedCollection
>;

export type CollectionsUpdatedAction = Action<
    COLLECTIONS_UPDATED,
    NormalizedCollection[]
>;

export type CollectionArchivedAction = Action<
    COLLECTION_ARCHIVED,
    io.Collection
>;

export type CollectionUnarchivedAction = Action<
    COLLECTION_UNARCHIVED,
    io.Collection
>;

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

export type BoardCollectionsLoadedAction = Action<
    BOARD_COLLECTIONS_LOADED,
    BoardCollectionsLoadedPayload
>;

export type CollectionsReorderedAction = Action<
    COLLECTIONS_REORDERED,
    CardPosition[]
>;

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

export type CollectionMovedAction = Action<
    COLLECTION_MOVED,
    CollectionMovedPayload
>;
export type CardFieldCreatedAction = Action<CARD_FIELD_CREATED, io.CardField>;

export function fetchCollections(
    payload: FetchCollectionsPayload
): FetchCollectionsAction {
    return createIOAction<FETCH_COLLECTIONS>(FETCH_COLLECTIONS, payload);
}

export function loadCard(payload: LoadCardPayload): LoadCardAction {
    return createIOAction<LOAD_CARD>(LOAD_CARD, payload);
}

export function loadBoardCards(payload: LoadCardsPayload): LoadCardsAction {
    let metadata: LoadMetadata = {
        root_id: payload.space_id,
        type: "board",
    };
    return createIOAction<LOAD_CARDS>(LOAD_CARDS, payload, metadata);
}

export function loadBoardCollections(
    payload: LoadCollectionsPayload
): LoadCollectionsAction {
    let metadata: LoadMetadata = {
        root_id: payload.space_id,
        type: "board",
    };
    return createIOAction<LOAD_COLLECTIONS>(
        LOAD_COLLECTIONS,
        payload,
        metadata
    );
}

export function getCard(payload: GetCardPayload): GetCardAction {
    return createIOAction<GET_CARD>(GET_CARD, payload);
}

export function fetchCards(payload: FetchCardsPayload): FetchCardsAction {
    return createIOAction<FETCH_CARDS>(FETCH_CARDS, payload);
}

export function completeCard(payload: CompleteCardPayload): CompleteCardAction {
    return createIOAction<COMPLETE_CARD>(COMPLETE_CARD, payload);
}

export function uncompleteCard(
    payload: UncompleteCardPayload
): UncompleteCardAction {
    return createIOAction<UNCOMPLETE_CARD>(UNCOMPLETE_CARD, payload);
}

export function cardArchived(card: io.Card): CardArchivedAction {
    return createAction(CARD_ARCHIVED, card);
}

export function cardUnarchived(card: io.Card): CardUnarchivedAction {
    return createAction(CARD_UNARCHIVED, card);
}

export function storeCard(card: io.Card): StoreCardAction {
    return createAction(STORE_CARD, card);
}

export function storeCards(cards: io.Card[]): StoreCardsAction {
    return createAction(STORE_CARDS, cards);
}

export function cardCreated(card: io.Card): CardCreatedAction {
    return createAction(CARD_CREATED, card);
}

export function cardDeleted(id: string): CardDeletedAction {
    return createAction(CARD_DELETED, { id });
}

export function cardsUpdated(cards: NormalizedCard[]): CardsUpdatedAction {
    return createAction(CARDS_UPDATED, cards);
}

export function cardLoaded(
    card: NormalizedCard,
    metadata?: LoadMetadata
): CardLoadedAction {
    return createAction(CARD_LOADED, card, metadata);
}

export function cardsLoaded(
    cards: NormalizedCard[],
    metadata?: LoadMetadata
): CardsLoadedAction {
    return createAction(CARDS_LOADED, cards, metadata);
}

export function moveCard(payload: MoveCardPayload): MoveCardAction {
    return createIOAction<MOVE_CARD>(MOVE_CARD, payload);
}

export function updateCard(payload: UpdateCardPayload): UpdateCardAction {
    return createIOAction<UPDATE_CARD>(UPDATE_CARD, payload);
}

export function cardUpdated(payload: NormalizedCard): CardUpdatedAction {
    return createAction(CARD_UPDATED, payload);
}

export function createCard(payload: CreateCardPayload): CreateCardAction {
    return createIOAction<CREATE_CARD>(CREATE_CARD, payload);
}

export function cardsReordered(payload: CardPosition[]): CardsReorderedAction {
    return createAction(CARDS_REORDERED, payload);
}

export function archiveCard(payload: ArchiveCardPayload): ArchiveCardAction {
    return createIOAction<ARCHIVE_CARD>(ARCHIVE_CARD, payload);
}

export function delelteCard(payload: DeleteCardPayload): DeleteCardAction {
    return createIOAction<DELETE_CARD>(DELETE_CARD, payload);
}

export function collectionDeleted(
    collection: Unique & BelongsToSpace
): CollectionDeletedAction {
    return createAction(COLLECTION_DELETED, collection);
}

export function collectionUnarchived(
    collection: io.Collection
): CollectionUnarchivedAction {
    return createAction(COLLECTION_UNARCHIVED, collection);
}

export function collectionArchived(
    collection: io.Collection
): CollectionArchivedAction {
    return createAction(COLLECTION_ARCHIVED, collection);
}

export function collectionCreated(
    collection: io.Collection
): CollectionCreatedAction {
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

export function moveCollection(
    payload: MoveCollectionPayload
): MoveCollectionAction {
    return createIOAction<MOVE_COLLECTION>(MOVE_COLLECTION, payload);
}

export function updateCollection(
    payload: UpdateCollectionPayload
): UpdateCollectionAction {
    return createIOAction<UPDATE_COLLECTION>(UPDATE_COLLECTION, payload);
}

export function deleteCollection(
    payload: DeleteCollectionPayload
): DeleteCollectionAction {
    return createIOAction<DELETE_COLLECTION>(DELETE_COLLECTION, payload);
}

export function collectionUpdated(
    payload: NormalizedCollection
): CollectionUpdatedAction {
    return createAction(COLLECTION_UPDATED, payload);
}

export function collectionsUpdated(
    payload: NormalizedCollection[]
): CollectionsUpdatedAction {
    return createAction(COLLECTIONS_UPDATED, payload);
}

export function createCollection(
    payload: CreateCollectionPayload
): CreateCollectionAction {
    return createIOAction<CREATE_COLLECTION>(CREATE_COLLECTION, payload);
}

export function storeCollections(
    payload: io.Collection[]
): StoreCollectionsAction {
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
    return createIOAction<CREATE_LABEL>(CREATE_LABEL, { space_id: id, params });
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

export function boardLabelUpdated(label: io.Label): BoardLabelUpdated {
    return createAction(LABEL_UPDATED, label);
}

export function labelLoaded(label: io.Label): LabelLoadedAction {
    return createAction(LABEL_LOADED, label);
}

export function labelsLoaded(label: io.Label[]): LabelsLoadedAction {
    return createAction(LABELS_LOADED, label);
}

export function createCardField(
    payload: CreateCardFieldPayload
): CreateCardFieldAction {
    return createIOAction<CREATE_CARD_FIELD>(CREATE_CARD_FIELD, payload);
}

export function updateCardField(
    payload: UpdateCardFieldPayload
): UpdateCardFieldAction {
    return createIOAction<UPDATE_CARD_FIELD>(UPDATE_CARD_FIELD, payload);
}

export function deleteCardField(
    payload: DeleteCardFieldPayload
): DeleteCardFieldAction {
    return createIOAction<DELETE_CARD_FIELD>(DELETE_CARD_FIELD, payload);
}

export function cardFieldCreated(
    payload: io.CardField
): CardFieldCreatedAction {
    return createAction(CARD_FIELD_CREATED, payload);
}

export function cardFieldUpdated(
    payload: io.CardField
): CardFieldUpdatedAction {
    return createAction(CARD_FIELD_UPDATED, payload);
}

export function cardFieldDeleted(
    payload: CardFieldDeletedPayload
): CardFieldDeletedAction {
    return createAction(CARD_FIELD_DELETED, payload);
}

export function setCardFieldValue(
    payload: SetCardFieldValuePayload
): SetCardFieldValueAction {
    return createIOAction<SET_CARD_FIELD>(SET_CARD_FIELD, payload);
}

export function createCardFieldValue(
    payload: CreateCardFieldValuePayload
): CreateCardFieldValueAction {
    return createIOAction<CREATE_CARD_FIELD_VALUE>(
        CREATE_CARD_FIELD_VALUE,
        payload
    );
}

export function updateCardFieldValue(
    payload: UpdateCardFieldValuePayload
): UpdateCardFieldValueAction {
    return createIOAction<UPDATE_CARD_FIELD_VALUE>(
        UPDATE_CARD_FIELD_VALUE,
        payload
    );
}

export function moveCardField(
    payload: MoveCardFieldPayload
): MoveCardFieldAction {
    return createIOAction<MOVE_CARD_FIELD>(MOVE_CARD_FIELD, payload);
}

export function deleteCardFieldValue(
    payload: DeleteCardFieldValuePayload
): DeleteCardFieldValueAction {
    return createIOAction<DELETE_CARD_FIELD_VALUE>(
        DELETE_CARD_FIELD_VALUE,
        payload
    );
}

export function cardFieldValueCreated(
    payload: CardFieldValueCreatedPayload
): CardFieldValueCreatedAction {
    return createAction(CARD_FIELD_VALUE_CREATED, payload);
}

export function cardFieldMoved(
    payload: CardFieldMovedPayload
): CardFieldMovedAction {
    return createAction(CARD_FIELD_MOVED, payload);
}

export function cardFieldValueUpdated(
    payload: CardFieldValueUpdatedPayload
): CardFieldValueUpdatedAction {
    return createAction(CARD_FIELD_VALUE_UPDATED, payload);
}

export function cardFieldValueDeleted(
    payload: CardFieldValueDeletedPayload
): CardFieldValueDeletedAction {
    return createAction(CARD_FIELD_VALUE_DELETED, payload);
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

export function cardMoved(payload: CardMovedPayload): CardMovedAction {
    return createAction(CARD_MOVED, payload);
}

export function collectionMoved(
    payload: CollectionMovedPayload
): CollectionMovedAction {
    return createAction(COLLECTION_MOVED, payload);
}

export function boardCardsLoaded(
    payload: BoardCardsLoadedPayload
): BoardCardsLoadedAction {
    return createAction(BOARD_CARDS_LOADED, payload);
}

export function boardConnected(
    payload: BoardConnectedPayload
): BoardConnectedAction {
    return createAction(BOARD_CONNECTED, payload);
}

export function boardCollectionsLoaded(
    payload: BoardCollectionsLoadedPayload
): BoardCollectionsLoadedAction {
    return createAction(BOARD_COLLECTIONS_LOADED, payload);
}

export function updateBoardFilter(
    payload: BoardFilterPayload
): BoardFilterUpdatedAction {
    return createAction(BOARD_FILTER_UPDATED, payload);
}
export function purgeBoard(payload: BoardPurgedPayload): BoardPurgedAction {
    return createAction(BOARD_PURGED, payload);
}

export function cardTemplateCreated(
    payload: io.CardTemplate
): CardTemplateCreatedAction {
    return createAction(CARD_TEMPLATE_CREATED, payload);
}
export function cardTemplateDeleted(
    payload: CardTemplateDeletedPayload
): CardTemplateDeletedAction {
    return createAction(CARD_TEMPLATE_DELETED, payload);
}

export function createCardTemplate(
    payload: CreateCardTemplatePayload
): CreateCardTemplateAction {
    return createIOAction<CREATE_CARD_TEMPLATE>(CREATE_CARD_TEMPLATE, payload);
}

export function deleteCardTemplate(
    payload: DeleteCardTemplatePayload
): DeleteCardTemplateAction {
    return createIOAction<DELETE_CARD_TEMPLATE>(DELETE_CARD_TEMPLATE, payload);
}

export function loadArchivedCards(
    payload: LoadArchivedCardsPayload
): LoadArchivedCardsAction {
    return createIOAction<LOAD_ARCHIVED_CARDS>(LOAD_ARCHIVED_CARDS, payload);
}
