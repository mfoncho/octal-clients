import { Record, Map, List } from "immutable";
import * as Actions from "../actions/types";
import * as AppActions from "../actions/app";
import * as SpaceActions from "../actions/space";
import * as BoardActions from "../actions/board";
import { Board } from "../records";

const collections = ["cards", "collections", "archived_cards"];

export class BoardsStore extends Record({
    loaded: Map<string, List<string>>(),
    spaces: Map<string, List<string>>(),
    entities: Map<string, Board>(),
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

    getSpaceBoard(id: string) {
        return this.entities.get(id);
    }

    removeSpaceBoard(id: string): BoardsStore {
        return this.withMutations((store) => {
            const spaces = store.spaces.get(id);
            if (spaces) {
                spaces.forEach((id) => store.removeBoard(id));
            }
        });
    }

    putBoard(payload: any): BoardsStore {
        if (this.contains(payload.id)) {
            if (payload instanceof Board) {
                return this.setIn(["entities", payload.space_id], payload);
            }
            return this;
        } else {
            const board = Board.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", board.space_id], board);

                // index space_id
                let spaces = store.spaces.get(board.space_id, List<string>());
                if (!spaces.includes(board.space_id))
                    store.setIn(
                        ["spaces", board.space_id],
                        spaces.push(board.space_id)
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
            return this.setIn(["entities", board.space_id], updated);
        }
    }

    removeBoard(id: string): BoardsStore {
        if (!this.contains(id)) {
            return this;
        } else {
            const board = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== board.space_id;

                // index user_id
                let spaces = store.spaces.get(board.space_id, List<string>());
                if (spaces.includes(board.space_id))
                    store.setIn(
                        ["spaces", board.space_id],
                        spaces.filter(filter)
                    );

                store.deleteIn(["entities", board.space_id]);
            });
        }
    }
}
export const state = new BoardsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.SPACE_LOADED](
        store: BoardsStore,
        { payload }: SpaceActions.SpaceLoadedAction
    ) {
        return store.putBoard(payload);
    },
    [Actions.CARD_TEMPLATE_CREATED](
        store: BoardsStore,
        { payload }: BoardActions.CardTemplateCreatedAction
    ) {
        let board = store.getSpaceBoard(payload.space_id);
        if (board) {
            board = board.putTemplate(payload);
            return store.setIn(["entities", board.space_id], board);
        }
        return store;
    },
    [Actions.CARD_TEMPLATE_DELETED](
        store: BoardsStore,
        { payload }: BoardActions.CardTemplateDeletedAction
    ) {
        let board = store.getSpaceBoard(payload.space_id);
        if (board) {
            board = board.removeTemplate(payload);
            return store.setIn(["entities", board.space_id], board);
        }
        return store;
    },
    [Actions.BOARD_FILTER_UPDATED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardFilterUpdatedAction
    ) => {
        let board = store.getSpaceBoard(payload.space_id);
        if (board) {
            board = board.updateFilter(payload.filter, payload.value);
            return store.setIn(["entities", payload.space_id], board);
        }
        return store;
    },

    [Actions.COLLECTION_LOADED]: (
        store: BoardsStore,
        { payload }: AppActions.DataLoadedAction
    ) => {
        const board = store.getSpaceBoard(payload.collection);
        if (board && collections.includes(payload.type)) {
            return store.setIn(
                ["entities", payload.collection],
                board.addLoaded(payload.type)
            );
        }
        return store;
    },

    [Actions.SPACE_PURGED]: (store: BoardsStore, { payload }: any) => {
        return store.removeSpaceBoard(payload.space_id);
    },

    [Actions.BOARD_PURGED]: (
        store: BoardsStore,
        { payload }: BoardActions.BoardPurgedAction
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

    [Actions.COLLECTIONS_LOADED]: (store: BoardsStore, { metadata }: any) => {
        if (metadata && metadata.type == "board") {
            return store.putLoaded(metadata.root_id, "collections");
        }
        return store;
    },
};

export default { state, reducers };
