import { Record, Map, List } from "immutable";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import * as BoardActions from "../actions/board";
import { BoardRecord } from "../records";

const collections = ["cards", "columns", "archived_cards"];

export class BoardsStore extends Record({
    loaded: Map<string, List<string>>(),
    spaces: Map<string, List<string>>(),
    entities: Map<string, BoardRecord>(),
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

    getBoard(id: string) {
        return this.entities.get(id);
    }

    getSpaceBoards(id: string) {
        return this.spaces.get(id);
    }

    removeSpaceBoards(id: string): BoardsStore {
        return this.withMutations((store) => {
            const boards = store.spaces.get(id);
            if (boards) {
                boards.forEach((id) => store.removeBoard(id));
            }
        });
    }

    patchLabel(payload: any): BoardsStore {
        const board = this.getBoard(payload.board_id);
        if (board) {
            return this.putBoard(board.patchLabel(payload));
        }
        return this;
    }

    putLabel(payload: any): BoardsStore {
        const board = this.getBoard(payload.board_id);
        if (board) {
            return this.putBoard(board.putLabel(payload));
        }
        return this;
    }

    removeLabel(payload: any): BoardsStore {
        const board = this.getBoard(payload.board_id);
        if (board) {
            return this.putBoard(board.removeLabel(payload.id));
        }
        return this;
    }

    putBoard(payload: any): BoardsStore {
        if (this.contains(payload.id)) {
            return this.setIn(["entities", payload.id], payload);
        } else {
            const board = BoardRecord.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", payload.id], board);

                // index space_id
                let boards = store.spaces.get(board.space_id, List<string>());
                if (!boards.includes(board.id))
                    store.setIn(
                        ["spaces", board.space_id],
                        boards.push(board.id)
                    );
            });
        }
    }
    patchBoard(payload: any): BoardsStore {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const board = this.entities.get(payload.id)!;
            const updated = board.patch(payload);
            return this.setIn(["entities", board.id], updated);
        }
    }

    removeBoard(id: string): BoardsStore {
        if (!this.contains(id)) {
            return this;
        } else {
            const board = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== board.id;

                // index user_id
                let boards = store.spaces.get(board.space_id, List<string>());
                if (boards.includes(board.id))
                    store.setIn(
                        ["spaces", board.space_id],
                        boards.filter(filter)
                    );

                store.deleteIn(["entities", board.id]);
            });
        }
    }
}
export const state = new BoardsStore();

export const reducers = {
    [Actions.LOGOUT](_store: any, _action: any) {
        return state;
    },
    [Actions.CARD_TEMPLATE_CREATED](
        store: BoardsStore,
        { payload }: BoardActions.CardTemplateCreatedAction
    ) {
        let board = store.getBoard(payload.board_id);
        if (board) {
            board = board.putTemplate(payload);
            return store.setIn(["entities", board.id], board);
        }
        return store;
    },
    [Actions.CARD_TEMPLATE_DELETED](
        store: BoardsStore,
        { payload }: BoardActions.CardTemplateDeletedAction
    ) {
        let board = store.getBoard(payload.board_id);
        if (board) {
            board = board.removeTemplate(payload);
            return store.setIn(["entities", board.id], board);
        }
        return store;
    },
    [Actions.BOARD_FILTER_UPDATED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardFilterUpdatedAction
    ) => {
        let board = store.getBoard(payload.board_id);
        if (board) {
            board = board.updateFilter(payload.filter, payload.value);
            return store.setIn(["entities", payload.board_id], board);
        }
        return store;
    },
    [Actions.BOARD_ARCHIVED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardArchivedAction
    ) => {
        return store.patchBoard({ ...payload, column_id: null });
    },
    [Actions.BOARD_UNARCHIVED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardArchivedAction
    ) => {
        return store.patchBoard(payload);
    },
    [Actions.BOARD_CREATED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardCreatedAction
    ) => {
        return store.putBoard(payload);
    },
    [Actions.BOARD_LOADED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardLoadedAction
    ) => {
        return store.putBoard(payload);
    },

    [Actions.COLLECTION_LOADED]: (
        store: BoardsStore,
        { payload }: AppActions.CollectionLoadedAction
    ) => {
        const board = store.getBoard(payload.collection);
        if (board && collections.includes(payload.type)) {
            return store.setIn(
                ["entities", payload.collection],
                board.addLoaded(payload.type)
            );
        }
        return store;
    },

    [Actions.BOARDS_LOADED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardsLoadedAction
    ) => {
        return payload.reduce((store, board) => {
            return store.putBoard(board);
        }, store);
    },

    [Actions.BOARD_UPDATED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardUpdatedAction
    ) => {
        return store.patchBoard(payload);
    },

    [Actions.SPACE_SHUTDOWN]: (store: BoardsStore, { payload }: any) => {
        return store.removeSpaceBoards(payload.id);
    },

    [Actions.LABEL_LOADED]: (
        store: BoardsStore,
        { payload }: BoardActions.LabelLoadedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_CREATED]: (
        store: BoardsStore,
        { payload }: BoardActions.LabelCreatedAction
    ) => {
        return store.putLabel(payload);
    },

    [Actions.LABEL_UPDATED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardLabelUpdated
    ) => {
        return store.patchLabel(payload);
    },

    [Actions.LABEL_DELETED]: (
        store: BoardsStore,
        { payload }: BoardActions.LabelDeletedAction
    ) => {
        return store.removeLabel(payload);
    },

    [Actions.BOARD_PURGED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardPurgedAction
    ) => {
        return store.removeBoard(payload.id);
    },

    [Actions.BOARD_DELETED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardDeletedAction
    ) => {
        return store.removeBoard(payload.id);
    },

    [Actions.CARDS_LOADED]: (
        store: BoardsStore,
        { metadata }: BoardActions.CardsLoadedAction
    ) => {
        if (metadata && metadata.type == "board") {
            return store.putLoaded(metadata.root_id, "cards");
        }
        return store;
    },

    [Actions.COLUMNS_LOADED]: (store: BoardsStore, { metadata }: any) => {
        if (metadata && metadata.type == "board") {
            return store.putLoaded(metadata.root_id, "columns");
        }
        return store;
    },
};

export default { state, reducers };
