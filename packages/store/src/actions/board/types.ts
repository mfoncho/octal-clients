/* eslint-disable @typescript-eslint/no-redeclare */

// Board actions

export const BOARD_PURGED = "BOARD_PURGED";
export type BOARD_PURGED = typeof BOARD_PURGED;

export const BOARD_CONNECTED = "BOARD_CONNECTED";
export type BOARD_CONNECTED = typeof BOARD_CONNECTED;

export const BOARD_FILTER_UPDATED = "BOARD_FILTER_UPDATED";
export type BOARD_FILTER_UPDATED = typeof BOARD_FILTER_UPDATED;

// Collection actions
export const GET_COLLECTION = "GET_COLLECTION";
export type GET_COLLECTION = typeof GET_COLLECTION;

export const CREATE_COLLECTION = "CREATE_COLLECTION";
export type CREATE_COLLECTION = typeof CREATE_COLLECTION;

export const COLLECTION_LOADED = "COLLECTION_LOADED";
export type COLLECTION_LOADED = typeof COLLECTION_LOADED;

export const STORE_COLLECTION = "STORE_COLLECTION";
export type STORE_COLLECTION = typeof STORE_COLLECTION;

export const STORE_COLLECTIONS = "STORE_COLLECTIONS";
export type STORE_COLLECTIONS = typeof STORE_COLLECTIONS;

export const MOVE_COLLECTION = "MOVE_COLLECTION";
export type MOVE_COLLECTION = typeof MOVE_COLLECTION;

export const COLLECTION_MOVED = "COLLECTION_MOVED";
export type COLLECTION_MOVED = typeof COLLECTION_MOVED;

export const COLLECTIONS_LOADED = "COLLECTIONS_LOADED";
export type COLLECTIONS_LOADED = typeof COLLECTIONS_LOADED;

export const DELETE_COLLECTION = "DELETE_COLLECTION";
export type DELETE_COLLECTION = typeof DELETE_COLLECTION;

export const UPDATE_COLLECTION = "UPDATE_COLLECTION";
export type UPDATE_COLLECTION = typeof UPDATE_COLLECTION;

export const LOAD_COLLECTIONS = "LOAD_COLLECTIONS";
export type LOAD_COLLECTIONS = typeof LOAD_COLLECTIONS;

export const BOARD_COLLECTIONS_LOADED = "BOARD_COLLECTIONS_LOADED";
export type BOARD_COLLECTIONS_LOADED = typeof BOARD_COLLECTIONS_LOADED;

export const FETCH_COLLECTIONS = "FETCH_COLLECTIONS";
export type FETCH_COLLECTIONS = typeof FETCH_COLLECTIONS;

export const ARCHIVE_COLLECTION = "ARCHIVE_COLLECTION";
export type ARCHIVE_COLLECTION = typeof ARCHIVE_COLLECTION;

export const UNARCHIVE_COLLECTION = "UNARCHIVE_COLLECTION";
export type UNARCHIVE_COLLECTION = typeof UNARCHIVE_COLLECTION;

export const COLLECTIONS_REORDERED = "COLLECTIONS_REORDERED";
export type COLLECTIONS_REORDERED = typeof COLLECTIONS_REORDERED;

export const COLLECTION_CREATED = "COLLECTION_CREATED";
export type COLLECTION_CREATED = typeof COLLECTION_CREATED;

export const COLLECTION_UPDATED = "COLLECTION_UPDATED";
export type COLLECTION_UPDATED = typeof COLLECTION_UPDATED;

export const COLLECTIONS_UPDATED = "COLLECTIONS_UPDATED";
export type COLLECTIONS_UPDATED = typeof COLLECTIONS_UPDATED;

export const COLLECTION_DELETED = "COLLECTION_DELETED";
export type COLLECTION_DELETED = typeof COLLECTION_DELETED;

export const COLLECTION_ARCHIVED = "COLLECTION_ARCHIVED";
export type COLLECTION_ARCHIVED = typeof COLLECTION_ARCHIVED;

export const COLLECTION_UNARCHIVED = "COLLECTION_UNARCHIVED";
export type COLLECTION_UNARCHIVED = typeof COLLECTION_UNARCHIVED;

// Card actions
export const GET_CARD = "GET_CARD";
export type GET_CARD = typeof GET_CARD;

export const CARD_LOADED = "CARD_LOADED";
export type CARD_LOADED = typeof CARD_LOADED;

export const CARDS_LOADED = "CARDS_LOADED";
export type CARDS_LOADED = typeof CARDS_LOADED;

export const STORE_CARD = "STORE_CARD";
export type STORE_CARD = typeof STORE_CARD;

export const STORE_CARDS = "STORE_CARDS";
export type STORE_CARDS = typeof STORE_CARDS;

export const CREATE_CARD = "CREATE_CARD";
export type CREATE_CARD = typeof CREATE_CARD;

export const DELETE_CARD = "DELETE_CARD";
export type DELETE_CARD = typeof DELETE_CARD;

export const MOVE_CARD = "MOVE_CARD";
export type MOVE_CARD = typeof MOVE_CARD;

export const CARD_MOVED = "CARD_MOVED";
export type CARD_MOVED = typeof CARD_MOVED;

export const UPDATE_CARD = "UPDATE_CARD";
export type UPDATE_CARD = typeof UPDATE_CARD;

export const FETCH_CARDS = "FETCH_CARDS";
export type FETCH_CARDS = typeof FETCH_CARDS;

export const ARCHIVE_CARD = "ARCHIVE_CARD";
export type ARCHIVE_CARD = typeof ARCHIVE_CARD;

export const LOAD_CARD = "LOAD_CARD";
export type LOAD_CARD = typeof LOAD_CARD;

export const LOAD_CARDS = "LOAD_CARDS";
export type LOAD_CARDS = typeof LOAD_CARDS;

export const LOAD_ARCHIVED_CARDS = "LOAD_ARCHIVED_CARDS";
export type LOAD_ARCHIVED_CARDS = typeof LOAD_ARCHIVED_CARDS;

export const BOARD_CARDS_LOADED = "BOARD_CARDS_LOADED";
export type BOARD_CARDS_LOADED = "BOARD_CARDS_LOADED";

export const CARD_CREATED = "CARD_CREATED";
export type CARD_CREATED = typeof CARD_CREATED;

export const CARD_LABELED = "CARD_LABELED";
export type CARD_LABELED = typeof CARD_LABELED;

export const CARD_UNLABELED = "CARD_UNLABELED";
export type CARD_UNLABELED = typeof CARD_UNLABELED;

export const CARD_ARCHIVED = "CARD_ARCHIVED";
export type CARD_ARCHIVED = typeof CARD_ARCHIVED;

export const COMPLETE_CARD = "COMPLETE_CARD";
export type COMPLETE_CARD = typeof COMPLETE_CARD;

export const UNCOMPLETE_CARD = "MARK_CARD_AS_UNDONE";
export type UNCOMPLETE_CARD = typeof UNCOMPLETE_CARD;

export const CARD_UNARCHIVED = "CARD_UNARCHIVED";
export type CARD_UNARCHIVED = typeof CARD_UNARCHIVED;

export const CARD_UPDATED = "CARD_UPDATED";
export type CARD_UPDATED = typeof CARD_UPDATED;

export const CARDS_UPDATED = "CARDS_UPDATED";
export type CARDS_UPDATED = typeof CARDS_UPDATED;

export const CARD_DELETED = "CARD_DELETED";
export type CARD_DELETED = typeof CARD_DELETED;

export const CARDS_REORDERED = "CARDS_REORDERED";
export type CARDS_REORDERED = typeof CARDS_REORDERED;

export const CREATE_CARD_TEMPLATE = "CREATE_CARD_TEMPLATE";
export type CREATE_CARD_TEMPLATE = typeof CREATE_CARD_TEMPLATE;

export const DELETE_CARD_TEMPLATE = "DELETE_CARD_TEMPLATE";
export type DELETE_CARD_TEMPLATE = typeof DELETE_CARD_TEMPLATE;

export const CARD_TEMPLATE_CREATED = "CARD_TEMPLATE_CREATED";
export type CARD_TEMPLATE_CREATED = typeof CARD_TEMPLATE_CREATED;

export const CARD_TEMPLATE_DELETED = "CARD_TEMPLATE_DELETED";
export type CARD_TEMPLATE_DELETED = typeof CARD_TEMPLATE_DELETED;

// Checklist actions
export const ASSIGN_CHECKLIST = "ASSIGN_CHECKLIST";
export type ASSIGN_CHECKLIST = typeof ASSIGN_CHECKLIST;

export const CHECKLIST_ASSIGNED = "CHECKLIST_ASSIGNED";
export type CHECKLIST_ASSIGNED = typeof CHECKLIST_ASSIGNED;

export const UNASSIGN_CHECKLIST = "UNASSIGN_CHECKLIST";
export type UNASSIGN_CHECKLIST = typeof UNASSIGN_CHECKLIST;

export const CHECKLIST_UNASSIGNED = "CHECKLIST_UNASSIGNED";
export type CHECKLIST_UNASSIGNED = typeof CHECKLIST_UNASSIGNED;

// Tag
export const CREATE_LABEL = "CREATE_LABEL";
export type CREATE_LABEL = typeof CREATE_LABEL;

export const UPDATE_LABEL = "UPDATE_LABEL";
export type UPDATE_LABEL = typeof UPDATE_LABEL;

export const LABEL_LOADED = "LABEL_LOADED";
export type LABEL_LOADED = typeof LABEL_LOADED;

export const LABELS_LOADED = "LABELS_LOADED";
export type LABELS_LOADED = typeof LABELS_LOADED;

export const DELETE_LABEL = "DELETE_LABEL";
export type DELETE_LABEL = typeof DELETE_LABEL;

export const LABEL_CREATED = "LABEL_CREATED";
export type LABEL_CREATED = typeof LABEL_CREATED;

export const LABEL_UPDATED = "LABEL_UPDATED";
export type LABEL_UPDATED = typeof LABEL_UPDATED;

export const LABEL_DELETED = "LABEL_DELETED";
export type LABEL_DELETED = typeof LABEL_DELETED;

// CARD FIELD
export const CREATE_CARD_FIELD = "CREATE_CARD_FIELD";
export type CREATE_CARD_FIELD = typeof CREATE_CARD_FIELD;

export const UPDATE_CARD_FIELD = "UPDATE_CARD_FIELD";
export type UPDATE_CARD_FIELD = typeof UPDATE_CARD_FIELD;

export const SET_CARD_FIELD = "SET_CARD_FIELD";
export type SET_CARD_FIELD = typeof SET_CARD_FIELD;

export const CREATE_CARD_FIELD_VALUE = "CREATE_CARD_FIELD_VALUE";
export type CREATE_CARD_FIELD_VALUE = typeof CREATE_CARD_FIELD_VALUE;

export const UPDATE_CARD_FIELD_VALUE = "UPDATE_CARD_FIELD_VALUE";
export type UPDATE_CARD_FIELD_VALUE = typeof UPDATE_CARD_FIELD_VALUE;

export const DELETE_CARD_FIELD_VALUE = "DELETE_CARD_FIELD_VALUE";
export type DELETE_CARD_FIELD_VALUE = typeof DELETE_CARD_FIELD_VALUE;

export const CARD_FIELD_VALUE_CREATED = "CARD_FIELD_VALUE_CREATED";
export type CARD_FIELD_VALUE_CREATED = typeof CARD_FIELD_VALUE_CREATED;

export const CARD_FIELD_VALUE_UPDATED = "CARD_FIELD_VALUE_UPDATED";
export type CARD_FIELD_VALUE_UPDATED = typeof CARD_FIELD_VALUE_UPDATED;

export const CARD_FIELD_VALUE_DELETED = "CARD_FIELD_VALUE_DELETED";
export type CARD_FIELD_VALUE_DELETED = typeof CARD_FIELD_VALUE_DELETED;

export const MOVE_CARD_FIELD = "MOVE_CARD_FIELD";
export type MOVE_CARD_FIELD = typeof MOVE_CARD_FIELD;

export const DELETE_CARD_FIELD = "DELETE_CARD_FIELD";
export type DELETE_CARD_FIELD = typeof DELETE_CARD_FIELD;

export const CARD_FIELD_CREATED = "CARD_FIELD_CREATED";
export type CARD_FIELD_CREATED = typeof CARD_FIELD_CREATED;

export const CARD_FIELD_UPDATED = "CARD_FIELD_UPDATED";
export type CARD_FIELD_UPDATED = typeof CARD_FIELD_UPDATED;

export const CARD_FIELD_MOVED = "CARD_FIELD_MOVED";
export type CARD_FIELD_MOVED = typeof CARD_FIELD_MOVED;

export const CARD_FIELD_DELETED = "CARD_FIELD_DELETED";
export type CARD_FIELD_DELETED = typeof CARD_FIELD_DELETED;
