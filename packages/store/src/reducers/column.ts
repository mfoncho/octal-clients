import { Record, List, Map } from "immutable";
import * as BoardActions from "../actions/board";
import { sort } from "@octal/common";
import * as Actions from "../actions/types";
import { ColumnRecord } from "../records";

const positionSort = sort("position", "asc");

export class ColumnsStore extends Record({
    boards: Map<string, List<string>>(),
    entities: Map<string, ColumnRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }
    getColumn(id: string) {
        return this.entities.get(id);
    }

    getSpaceColumns(id: string) {
        return this.boards.get(id);
    }

    removeSpaceColumns(id: string): ColumnsStore {
        return this.withMutations((store) => {
            const boards = store.boards.get(id);
            if (boards) {
                boards.forEach((id) => store.removeColumn(id));
            }
        });
    }

    putColumn(payload: any): ColumnsStore {
        if (this.contains(payload.id)) {
            return this.patchColumn(payload);
        } else {
            const board = ColumnRecord.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", payload.id], board);

                // index board_id
                let boards = store.boards.get(board.board_id, List<string>());
                if (!boards.includes(board.board_id))
                    store.setIn(
                        ["boards", board.board_id],
                        boards.push(board.id)
                    );
            });
        }
    }
    patchColumn(payload: any): ColumnsStore {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const column = this.entities.get(payload.id)!;
            const updated = column.patch(payload);
            if (column.position !== updated.position) {
                return this.withMutations((store) => {
                    store.boards
                        .get(column.board_id, List<string>())
                        .map((id) => this.getColumn(id)!)
                        .filter(Boolean)
                        .sort(positionSort)
                        .filter((col) => col.id !== column.id)
                        .insert(updated.position, updated)
                        .forEach((column, index) => {
                            store.setIn(
                                ["entities", column.id],
                                column.merge({ position: index })
                            );
                        });
                });
            }
            return this.setIn(["entities", column.id], updated);
        }
    }

    removeColumn(id: string): ColumnsStore {
        if (!this.contains(id)) {
            return this;
        } else {
            const board = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== board.id;

                // index user_id
                let boards = store.boards.get(board.board_id, List<string>());
                if (boards.includes(board.board_id))
                    store.setIn(["boards"], boards.filter(filter));

                store.deleteIn(["entities", board.id]);
            });
        }
    }
}

export const state = new ColumnsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.COLUMN_CREATED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnCreatedAction
    ) => {
        return store.putColumn(payload);
    },
    [Actions.COLUMN_LOADED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnLoadedAction
    ) => {
        return store.putColumn(payload);
    },

    [Actions.BOARD_DELETED]: (store: ColumnsStore, { payload }: any) => {
        let cids = store.boards.get(payload.id);
        if (cids && !cids.isEmpty()) {
            return cids.reduce((store, id) => {
                return store.removeColumn(id);
            }, store);
        }
        return store;
    },

    [Actions.COLUMNS_LOADED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnsLoadedAction
    ) => {
        return payload.reduce(
            (store, payload) => store.putColumn(payload),
            store
        );
    },

    [Actions.COLUMN_UPDATED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnUpdatedAction
    ) => {
        return store.patchColumn(payload);
    },
    [Actions.COLUMNS_UPDATED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnsUpdatedAction
    ) => {
        return payload.reduce(
            (store: ColumnsStore, column: any) => store.patchColumn(column),
            store
        );
    },

    [Actions.COLUMNS_REORDERED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnsReorderedAction
    ) => {
        return payload.reduce((store, col) => {
            return store.patchColumn(col);
        }, store);
    },

    [Actions.COLUMN_MOVED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnMovedAction
    ) => {
        return store.patchColumn(payload);
    },

    [Actions.COLUMN_ARCHIVED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnUpdatedAction
    ) => {
        return store.patchColumn(payload);
    },

    [Actions.COLUMN_UNARCHIVED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnUpdatedAction
    ) => {
        return store.patchColumn(payload);
    },
    [Actions.COLUMN_DELETED]: (
        store: ColumnsStore,
        { payload }: BoardActions.ColumnDeletedAction
    ) => {
        return store.removeColumn(payload.id);
    },
};

export default { state, reducers };
