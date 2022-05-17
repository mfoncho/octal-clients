import type { io, BelongsToBoard, Unique, BelongsToSpace } from "@octal/client";
import type { Channel } from "@octal/endpoint";
import type { Require } from "@octal/common";
import type { Action, IOAction } from "../../types";
import { createAction, createIOAction } from "../../action";
import { NormalizedCard, NormalizedColumn } from "../../schemas";
import {
    BOARD_FILTER_UPDATED,
    BOARD_CONNECTED,
    LOAD_BOARD,
    LOAD_BOARDS,
    TRACKERS_LOADED,
    BOARD_COLUMNS_LOADED,
    BOARD_CARDS_LOADED,
    BOARD_DELETED,
    BOARDS_LOADED,
    COLUMNS_UPDATED,
    CARDS_UPDATED,
    CREATE_BOARD,
    BOARD_CREATED,
    DELETE_BOARD,
    LABEL_DELETED,
    LABEL_CREATED,
    CREATE_LABEL,
    DELETE_LABEL,
    UPDATE_LABEL,
    BOARD_LOADED,
    LABEL_LOADED,
    LABELS_LOADED,
    MOVE_CARD,
    UNARCHIVE_CARD,
    ARCHIVE_COLUMN,
    STORE_COLUMNS,
    UNARCHIVE_COLUMN,
    MOVE_COLUMN,
    UPDATE_COLUMN,
    CREATE_CARD,
    UPDATE_CARD,
    CARDS_REORDERED,
    STORE_CARD,
    STORE_CARDS,
    CARD_LOADED,
    CARDS_LOADED,
    CARD_UPDATED,
    CARD_DELETED,
    COLUMN_DELETED,
    CREATE_COLUMN,
    FETCH_CARDS,
    COLUMN_LOADED,
    COLUMNS_LOADED,
    COLUMNS_REORDERED,
    COLUMN_UPDATED,
    ARCHIVE_CARD,
    CARD_CREATED,
    COLUMN_CREATED,
    COLUMN_ARCHIVED,
    COLUMN_UNARCHIVED,
    GET_CARD,
    CARD_LABELED,
    CARD_UNLABELED,
    CARD_ARCHIVED,
    CARD_UNARCHIVED,
    DELETE_CARD,
    CARD_MOVED,
    COMPLETE_CARD,
    UNCOMPLETE_CARD,
    LABEL_CARD,
    UNLABEL_CARD,
    LOAD_CARDS,
    LOAD_COLUMNS,
    FETCH_COLUMNS,
    DELETE_COLUMN,
    UPDATE_CARD_FIELD,
    CLEAR_CARDS,
    COLUMN_MOVED,
    UPDATE_BOARD,
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
    CREATE_TRACKER,
    DELETE_TRACKER,
    TRACKER_CREATED,
    TRACKER_DELETED,
    BOARD_UPDATED,
} from "./types";

export * from "./types";

export interface BoardFilterPayload {
    board_id: string;
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

export interface BoardColumnsLoadedPayload {
    board_id: string;
    columns: NormalizedColumn[];
}

export interface BoardCardsLoadedPayload {
    board_id: string;
    cards: NormalizedCard[];
}

export interface CreateTrackerPayload {
    entity_id: string;
    params: {
        event: string;
    };
}

export interface DeleteTrackerPayload {
    entity_id: string;
    params: {
        event: string;
    };
}

export interface TrackerCreatedPayload {
    entity_id: string;
    event: string;
}

export interface TrackerDeletedPayload {
    entity_id: string;
    event: string;
}

export interface AssignChecklistPayload {
    field_id: string;
    card_id: string;
    user_id: string;
}

export interface CardMovedPayload {
    id: string;
    position: number;
    column_id: string;
}

export interface ColumnMovedPayload {
    id: string;
    position: number;
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
    position: number;
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
    board_id: string;
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
    board_id?: string;
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
        position: number;
    };
}

export interface DeleteCardFieldPayload {
    card_id: string;
    field_id: string;
}

export interface CreateBoardPayload {
    space_id: string;
    params: {
        name: string;
    };
}

export interface DeleteBoardPayload {
    board_id: string;
    space_id: string;
}

export interface BoardDeletedPayload {
    id: string;
    space_id: string;
}

export interface UpdateBoardPayload {
    board_id: string;
    space_id: string;
    params: {
        name?: string;
    };
}

export interface GetCardPayload {
    board_id: string;
    card_id?: string;
}

export interface ClearCardPayload {
    id: string;
    thread_id: string;
    column_id: string | null;
    board_id: string;
}

export interface CreateColumnPayload {
    name: string;
    origin: boolean;
    capacity: number;
    board_id: string;
    type: "stack" | "queue";
}

export interface UpdateColumnPayload {
    name?: string;
    origin?: boolean;
    column_id: string;
    board_id: string;
    capacity?: number;
    type?: "stack" | "queue";
}

export interface MoveColumnPayload {
    position: number;
    column_id: string;
    board_id: string;
}

export interface ArchiveColumnPayload {
    column_id: string;
    board_id: string;
}

export interface UnarchiveColumnPayload {
    column_id: string;
    board_id: string;
}

export interface DeleteColumnPayload {
    board_id: string;
    column_id: string;
}

export interface FetchCardsPayload {
    board_id: string;
    column_id?: string;
}

export interface FetchColumnsPayload {
    board_id: string;
}

export interface MoveCardPayload {
    card_id: string;
    position?: number;
    column_id: string;
    board_id: string;
}

export interface CardPosition {
    id: string;
    position: number;
    column_id: string;
}

export interface DeleteCardPayload {
    board_id: string;
    card_id: string;
}

export interface ColumnPosition {
    id: string;
    position: number;
}

export interface UpdateCardPayload {
    name?: string;
    card_id: string;
    board_id: string;
}

export interface CreateCardPayload {
    name: string;
    board_id: string;
    column_id: string;
    template_id?: string;
}

export interface ArchiveCardPayload {
    card_id: string;
    board_id: string;
}

export interface UnarchiveCardPayload extends ArchiveCardPayload {
    column_id: string;
}

export interface CompleteCardPayload {
    card_id: string;
    board_id: string;
}

export interface UncompleteCardPayload {
    card_id: string;
    board_id: string;
}

export interface LabelCardPayload {
    label_id: string;
    card_id: string;
    board_id: string;
}

export interface UnlabelCardPayload {
    label_id: string;
    card_id: string;
    board_id: string;
}

export interface CreateChecklistPayload {
    name: string;
    card_id: string;
    user_id: string;
    board_id: string;
}

export interface UpdateChecklistPayload {
    name: string;
    board_id: string;
    checklist_id: string;
}

export interface ReassignChecklistPayload {
    user_id: string;
    board_id: string;
    checklist_id: string;
}

export interface DeleteChecklistPayload {
    card_id: string;
    board_id: string;
    checklist_id: string;
}

export interface LoadColumnsPayload {
    board_id: string;
}

export interface LoadCardsPayload {
    board_id: string;
}

export interface CreateLabelParams {
    name: string;
    color: string;
}

export interface CreateLabelPayload {
    board_id: string;
    params: CreateLabelParams;
}

export interface DeleteLabelPayload {
    board_id: string;
    label_id: string;
}

export interface UpdateLabelPayload {
    board_id: string;
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

export interface UnarchiveColumnPayload extends ArchiveColumnPayload {}

export type RemoveLabelPayload = Require<Partial<io.Label>, "id" | "board_id">;

export type RemoveLabelsPayload = RemoveLabelPayload[];

export type BoardFilterUpdatedAction = Action<
    BOARD_FILTER_UPDATED,
    BoardFilterPayload
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

export type LoadBoardAction = IOAction<LOAD_BOARD, LoadBoardPayload, io.Board>;

export type LoadSpaceBoardsAction = IOAction<
    LOAD_BOARDS,
    LoadSpaceBoardsPayload,
    io.Board[]
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

export type BoardLoadedAction = Action<BOARD_LOADED, io.Board>;

export type BoardsLoadedAction = Action<BOARDS_LOADED, io.Board[]>;

export type BoardCreatedAction = Action<BOARD_CREATED, io.Board>;

export type UpdateBoardAction = IOAction<
    UPDATE_BOARD,
    UpdateBoardPayload,
    io.Board
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

export type ClearCardsAction = Action<CLEAR_CARDS, ClearCardPayload[]>;

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

export type FetchColumnsAction = IOAction<
    FETCH_COLUMNS,
    FetchColumnsPayload,
    io.Column[]
>;

export type LabelCardAction = IOAction<
    LABEL_CARD,
    LabelCardPayload,
    io.CardLabel
>;

export type UnlabelCardAction = IOAction<
    UNLABEL_CARD,
    UnlabelCardPayload,
    string
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

export type UnarchiveCardAction = IOAction<
    UNARCHIVE_CARD,
    UnarchiveCardPayload,
    io.Card
>;

export type CardArchivedAction = Action<CARD_ARCHIVED, io.Card>;

export type CardUnarchivedAction = Action<CARD_UNARCHIVED, io.Card>;

export type ColumnCreatedAction = Action<COLUMN_CREATED, io.Column>;

export type ColumnDeletedAction = Action<
    COLUMN_DELETED,
    Unique & { board_id: string }
>;

export type ColumnUpdatedAction = Action<COLUMN_UPDATED, NormalizedColumn>;

export type ColumnsUpdatedAction = Action<COLUMNS_UPDATED, NormalizedColumn[]>;

export type ColumnArchivedAction = Action<COLUMN_ARCHIVED, io.Column>;

export type ColumnUnarchivedAction = Action<COLUMN_UNARCHIVED, io.Column>;

export type StoreColumnsAction = Action<STORE_COLUMNS, io.Column[]>;

export type ColumnLoadedAction = Action<
    COLUMN_LOADED,
    NormalizedColumn,
    LoadMetadata
>;

export type ColumnsLoadedAction = Action<
    COLUMNS_LOADED,
    NormalizedColumn[],
    LoadMetadata
>;

export type BoardColumnsLoadedAction = Action<
    BOARD_COLUMNS_LOADED,
    BoardColumnsLoadedPayload
>;

export type ColumnsReorderedAction = Action<COLUMNS_REORDERED, CardPosition[]>;

export type TrackersLoadedAction = Action<TRACKERS_LOADED, io.Trackers>;

export type TrackerCreatedAction = Action<
    TRACKER_CREATED,
    TrackerCreatedPayload
>;

export type TrackerDeletedAction = Action<
    TRACKER_DELETED,
    TrackerDeletedPayload
>;

export type LoadColumnsAction = IOAction<
    LOAD_COLUMNS,
    LoadColumnsPayload,
    io.Column[],
    LoadMetadata
>;

export type CreateColumnAction = IOAction<
    CREATE_COLUMN,
    CreateColumnPayload,
    io.Column
>;

export type DeleteColumnAction = IOAction<
    DELETE_COLUMN,
    DeleteColumnPayload,
    any
>;

export type UpdateColumnAction = IOAction<
    UPDATE_COLUMN,
    UpdateColumnPayload,
    io.Column
>;

export type MoveColumnAction = IOAction<
    MOVE_COLUMN,
    MoveColumnPayload,
    ColumnPosition
>;

export type ArchiveColumnAction = IOAction<
    ARCHIVE_COLUMN,
    ArchiveColumnPayload,
    io.Column
>;

export type UnarchiveColumnAction = IOAction<
    UNARCHIVE_COLUMN,
    ArchiveColumnPayload,
    io.Column
>;

export type CreateBoardAction = IOAction<
    CREATE_BOARD,
    CreateBoardPayload,
    io.Board
>;

export type CreateTrackerAction = IOAction<
    CREATE_TRACKER,
    CreateTrackerPayload,
    any
>;

export type DeleteTrackerAction = IOAction<
    DELETE_TRACKER,
    DeleteTrackerPayload,
    any
>;

export type CardMovedAction = Action<CARD_MOVED, CardMovedPayload>;

export type ColumnMovedAction = Action<COLUMN_MOVED, ColumnMovedPayload>;

export type DeleteBoardAction = IOAction<DELETE_BOARD, DeleteBoardPayload, any>;

export type BoardDeletedAction = Action<BOARD_DELETED, BoardDeletedPayload>;

export type BoardUpdatedAction = Action<BOARD_UPDATED, BoardPartial>;

export type CardFieldCreatedAction = Action<CARD_FIELD_CREATED, io.CardField>;

export function fetchColumns(payload: FetchColumnsPayload): FetchColumnsAction {
    return createIOAction<FETCH_COLUMNS>(FETCH_COLUMNS, payload);
}

export function loadBoardCards(payload: LoadCardsPayload): LoadCardsAction {
    let metadata: LoadMetadata = {
        root_id: payload.board_id,
        type: "board",
    };
    return createIOAction<LOAD_CARDS>(LOAD_CARDS, payload, metadata);
}

export function loadBoardColumns(
    payload: LoadColumnsPayload
): LoadColumnsAction {
    let metadata: LoadMetadata = {
        root_id: payload.board_id,
        type: "board",
    };
    return createIOAction<LOAD_COLUMNS>(LOAD_COLUMNS, payload, metadata);
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

export function clearCards(payload: ClearCardPayload[]): ClearCardsAction {
    return createAction(CLEAR_CARDS, payload);
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

export function unarchiveCard(
    payload: UnarchiveCardPayload
): UnarchiveCardAction {
    return createIOAction<UNARCHIVE_CARD>(UNARCHIVE_CARD, payload);
}
export function columnDeleted(
    column: Unique & BelongsToBoard
): ColumnDeletedAction {
    return createAction(COLUMN_DELETED, column);
}

export function columnUnarchived(column: io.Column): ColumnUnarchivedAction {
    return createAction(COLUMN_UNARCHIVED, column);
}

export function columnArchived(column: io.Column): ColumnArchivedAction {
    return createAction(COLUMN_ARCHIVED, column);
}

export function columnCreated(column: io.Column): ColumnCreatedAction {
    return createAction(COLUMN_CREATED, column);
}

export function columnLoaded(
    column: NormalizedColumn,
    metadata?: LoadMetadata
): ColumnLoadedAction {
    return createAction(COLUMN_LOADED, column, metadata);
}

export function columnsLoaded(
    columns: NormalizedColumn[],
    metadata?: LoadMetadata
): ColumnsLoadedAction {
    return createAction(COLUMNS_LOADED, columns, metadata);
}

export function moveColumn(payload: MoveColumnPayload): MoveColumnAction {
    return createIOAction<MOVE_COLUMN>(MOVE_COLUMN, payload);
}

export function updateColumn(payload: UpdateColumnPayload): UpdateColumnAction {
    return createIOAction<UPDATE_COLUMN>(UPDATE_COLUMN, payload);
}

export function deleteColumn(payload: DeleteColumnPayload): DeleteColumnAction {
    return createIOAction<DELETE_COLUMN>(DELETE_COLUMN, payload);
}

export function columnUpdated(payload: NormalizedColumn): ColumnUpdatedAction {
    return createAction(COLUMN_UPDATED, payload);
}

export function columnsUpdated(
    payload: NormalizedColumn[]
): ColumnsUpdatedAction {
    return createAction(COLUMNS_UPDATED, payload);
}

export function createColumn(payload: CreateColumnPayload): CreateColumnAction {
    return createIOAction<CREATE_COLUMN>(CREATE_COLUMN, payload);
}

export function storeColumns(payload: io.Column[]): StoreColumnsAction {
    return createAction<STORE_COLUMNS>(STORE_COLUMNS, payload);
}

export function columnsReordered(
    payload: ColumnPosition[]
): ColumnsReorderedAction {
    return createAction<COLUMNS_REORDERED>(COLUMNS_REORDERED, payload);
}

export function archiveColumn(
    payload: ArchiveColumnPayload
): ArchiveColumnAction {
    return createIOAction<ARCHIVE_COLUMN>(ARCHIVE_COLUMN, payload);
}

export function unarchiveColumn(
    payload: UnarchiveColumnPayload
): UnarchiveColumnAction {
    return createIOAction<UNARCHIVE_COLUMN>(UNARCHIVE_COLUMN, payload);
}

// Label

export function createLabel(
    id: string,
    params: CreateLabelParams
): CreateLabelAction {
    return createIOAction<CREATE_LABEL>(CREATE_LABEL, { board_id: id, params });
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

// Board
export function boardLoaded(payload: io.Board): BoardLoadedAction {
    return createAction(BOARD_LOADED, payload);
}

export function boardsLoaded(payload: io.Board[]): BoardsLoadedAction {
    return createAction(BOARDS_LOADED, payload);
}

export function boardUpdated(payload: BoardPartial): BoardUpdatedAction {
    return createAction(BOARD_UPDATED, payload);
}

export function boardDeleted(payload: BoardDeletedPayload): BoardDeletedAction {
    return createAction(BOARD_DELETED, payload);
}

export function updateBoard(payload: UpdateBoardPayload): UpdateBoardAction {
    return createIOAction<UPDATE_BOARD>(UPDATE_BOARD, payload);
}

export function createBoard(payload: CreateBoardPayload): CreateBoardAction {
    return createIOAction<CREATE_BOARD>(CREATE_BOARD, payload);
}

export function deleteBoard(payload: DeleteBoardPayload): DeleteBoardAction {
    return createIOAction<DELETE_BOARD>(DELETE_BOARD, payload);
}

// Card Field
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

export function columnMoved(payload: ColumnMovedPayload): ColumnMovedAction {
    return createAction(COLUMN_MOVED, payload);
}

export function createTracker(
    payload: CreateTrackerPayload
): CreateTrackerAction {
    return createIOAction<CREATE_TRACKER>(CREATE_TRACKER, payload);
}

export function deleteTracker(
    payload: DeleteTrackerPayload
): DeleteTrackerAction {
    return createIOAction<DELETE_TRACKER>(DELETE_TRACKER, payload);
}

export function trackerCreated(
    payload: TrackerCreatedPayload
): TrackerCreatedAction {
    return createAction(TRACKER_CREATED, payload);
}

export function trackerDeleted(
    payload: TrackerDeletedPayload
): TrackerDeletedAction {
    return createAction(TRACKER_DELETED, payload);
}

export function trackersLoaded(payload: io.Trackers): TrackersLoadedAction {
    return createAction(TRACKERS_LOADED, payload);
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

export function boardCreated(payload: io.Board): BoardCreatedAction {
    return createAction(BOARD_CREATED, payload);
}

export function boardColumnsLoaded(
    payload: BoardColumnsLoadedPayload
): BoardColumnsLoadedAction {
    return createAction(BOARD_COLUMNS_LOADED, payload);
}

export function updateBoardFilter(
    payload: BoardFilterPayload
): BoardFilterUpdatedAction {
    return createAction(BOARD_FILTER_UPDATED, payload);
}
export function loadBoard(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadBoardAction {
    return createIOAction<LOAD_BOARD>(LOAD_BOARD, { id, params });
}

export function loadSpaceBoards(
    id: string,
    params: { [key: string]: string | number } = {}
): LoadSpaceBoardsAction {
    return createIOAction<LOAD_BOARDS>(LOAD_BOARDS, { id, params });
}
