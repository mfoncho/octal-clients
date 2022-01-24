/* eslint-disable @typescript-eslint/no-redeclare */

// Board actions
export const BOARD_LOADED = "BOARD_LOADED";
export type BOARD_LOADED = typeof BOARD_LOADED;

export const BOARDS_LOADED = "BOARDS_LOADED";
export type BOARDS_LOADED = typeof BOARDS_LOADED;

export const BOARD_DELETED = "BOARD_DELETED";
export type BOARD_DELETED = typeof BOARD_DELETED;

export const CREATE_BOARD = "CREATE_BOARD";
export type CREATE_BOARD = typeof CREATE_BOARD;

export const BOARD_CREATED = "BOARD_CREATED";
export type BOARD_CREATED = typeof BOARD_CREATED;

export const DELETE_BOARD = "DELETE_BOARD";
export type DELETE_BOARD = typeof DELETE_BOARD;

export const UPDATE_BOARD = "UPDATE_BOARD";
export type UPDATE_BOARD = typeof UPDATE_BOARD;

export const BOARD_UPDATED = "BOARD_UPDATED";
export type BOARD_UPDATED = typeof BOARD_UPDATED;

// Column actions
export const GET_COLUMN = "GET_COLUMN";
export type GET_COLUMN = typeof GET_COLUMN;

export const CREATE_COLUMN = "CREATE_COLUMN";
export type CREATE_COLUMN = typeof CREATE_COLUMN;

export const COLUMN_LOADED = "COLUMN_LOADED";
export type COLUMN_LOADED = typeof COLUMN_LOADED;

export const STORE_COLUMN = "STORE_COLUMN";
export type STORE_COLUMN = typeof STORE_COLUMN;

export const STORE_COLUMNS = "STORE_COLUMNS";
export type STORE_COLUMNS = typeof STORE_COLUMNS;

export const MOVE_COLUMN = "MOVE_COLUMN";
export type MOVE_COLUMN = typeof MOVE_COLUMN;

export const COLUMN_MOVED = "COLUMN_MOVED";
export type COLUMN_MOVED = typeof COLUMN_MOVED;

export const COLUMNS_LOADED = "COLUMNS_LOADED";
export type COLUMNS_LOADED = typeof COLUMNS_LOADED;

export const DELETE_COLUMN = "DELETE_COLUMN";
export type DELETE_COLUMN = typeof DELETE_COLUMN;

export const UPDATE_COLUMN = "UPDATE_COLUMN";
export type UPDATE_COLUMN = typeof UPDATE_COLUMN;

export const LOAD_COLUMNS = "LOAD_COLUMNS";
export type LOAD_COLUMNS = typeof LOAD_COLUMNS;

export const BOARD_COLUMNS_LOADED = "BOARD_COLUMNS_LOADED";
export type BOARD_COLUMNS_LOADED = typeof BOARD_COLUMNS_LOADED;

export const FETCH_COLUMNS = "FETCH_COLUMNS";
export type FETCH_COLUMNS = typeof FETCH_COLUMNS;

export const ARCHIVE_COLUMN = "ARCHIVE_COLUMN";
export type ARCHIVE_COLUMN = typeof ARCHIVE_COLUMN;

export const UNARCHIVE_COLUMN = "UNARCHIVE_COLUMN";
export type UNARCHIVE_COLUMN = typeof UNARCHIVE_COLUMN;

export const COLUMNS_REORDERED = "COLUMNS_REORDERED";
export type COLUMNS_REORDERED = typeof COLUMNS_REORDERED;

export const COLUMN_CREATED = "COLUMN_CREATED";
export type COLUMN_CREATED = typeof COLUMN_CREATED;

export const COLUMN_UPDATED = "COLUMN_UPDATED";
export type COLUMN_UPDATED = typeof COLUMN_UPDATED;

export const COLUMNS_UPDATED = "COLUMNS_UPDATED";
export type COLUMNS_UPDATED = typeof COLUMNS_UPDATED;

export const COLUMN_DELETED = "COLUMN_DELETED";
export type COLUMN_DELETED = typeof COLUMN_DELETED;

export const COLUMN_ARCHIVED = "COLUMN_ARCHIVED";
export type COLUMN_ARCHIVED = typeof COLUMN_ARCHIVED;

export const COLUMN_UNARCHIVED = "COLUMN_UNARCHIVED";
export type COLUMN_UNARCHIVED = typeof COLUMN_UNARCHIVED;

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

export const CARD_MOVED = "MOVED_CARD";
export type CARD_MOVED = typeof CARD_MOVED;

export const UPDATE_CARD = "UPDATE_CARD";
export type UPDATE_CARD = typeof UPDATE_CARD;

export const LABEL_CARD = "LABEL_CARD";
export type LABEL_CARD = typeof LABEL_CARD;

export const UNLABEL_CARD = "UNLABEL_CARD";
export type UNLABEL_CARD = typeof UNLABEL_CARD;

export const FETCH_CARDS = "FETCH_CARDS";
export type FETCH_CARDS = typeof FETCH_CARDS;

export const ARCHIVE_CARD = "ARCHIVE_CARD";
export type ARCHIVE_CARD = typeof ARCHIVE_CARD;

export const UNARCHIVE_CARD = "UNARCHIVE_CARD";
export type UNARCHIVE_CARD = typeof UNARCHIVE_CARD;

export const LOAD_CARDS = "LOAD_CARDS";
export type LOAD_CARDS = typeof LOAD_CARDS;

export const BOARD_CARDS_LOADED = "BOARD_CARDS_LOADED";
export type BOARD_CARDS_LOADED = "BOARD_CARDS_LOADED";

export const CLEAR_CARDS = "CLEAR_CARDS";
export type CLEAR_CARDS = typeof CLEAR_CARDS;

export const CARD_CREATED = "CARD_CREATED";
export type CARD_CREATED = typeof CARD_CREATED;

export const CREATE_TRACKER = "CREATE_TRACKER";
export type CREATE_TRACKER = typeof CREATE_TRACKER;

export const DELETE_TRACKER = "DELETE_TRACKER";
export type DELETE_TRACKER = typeof DELETE_TRACKER;

export const TRACKER_CREATED = "TRACKER_CREATED";
export type TRACKER_CREATED = typeof TRACKER_CREATED;

export const TRACKER_DELETED = "TRACKER_DELETED";
export type TRACKER_DELETED = typeof TRACKER_DELETED;

export const TRACKERS_LOADED = "TRACKERS_LOADED";
export type TRACKERS_LOADED = typeof TRACKERS_LOADED;

export const CARD_LABELED = "CARD_LABELED";
export type CARD_LABELED = typeof CARD_LABELED;

export const CARD_UNLABELED = "CARD_UNLABELED";
export type CARD_UNLABELED = typeof CARD_UNLABELED;

export const CARD_ARCHIVED = "CARD_ARCHIVED";
export type CARD_ARCHIVED = typeof CARD_ARCHIVED;

export const CARD_DONE = "CARD_DONE";
export type CARD_DONE = typeof CARD_DONE;

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
