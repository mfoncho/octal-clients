import { CardRecord, CollectionRecord, CardFieldRecord } from "@colab/store";
import { OrderedMap } from "immutable";
import { useContext, useCallback, useMemo } from "react";
import * as BoardAction from "@colab/store/lib/actions/board";
import Context, { Cards, Dragged } from "./Context";
import { useDispatch } from "react-redux";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { useBoardCollections, Actions } from "@colab/store";
export { useMembers, useMember } from "../Space/hooks";

const defaultCards = OrderedMap<string, CardRecord>();

export interface IDrawer {
    type: string;
    card_id?: string;
    user_id?: string;
    board_id?: string;
    space_id?: string;
    topic_id?: string;
    thread_id?: string;
    message_id?: string;
}

const drawer: IDrawer = {
    type: "",
    thread_id: "",
};

export function useBoard() {
    return useContext(Context);
}

export function useDragged() {
    return useContext(Dragged);
}

export function useLabels() {
    return useBoard().labels;
}

export function useCards() {
    return useContext(Cards);
}

export function useCollectionCards(id: string) {
    return useCards().get(id, defaultCards);
}

export function useDrawer(id: string) {
    return useWorkspaceDrawer(id, drawer);
}

export function useCollections() {
    const board = useBoard();
    return useBoardCollections(board.id);
}

export function useBoardActions() {
    const board = useBoard();
    const dispatch = useDispatch();
    const updateBoard = useCallback(
        (params: { name: string }) => {
            const action = BoardAction.updateBoard({
                board_id: board.id,
                space_id: board.space_id,
                params,
            });
            return dispatch(action);
        },
        [board.id]
    );

    const filter = useCallback(
        (filter: string, value: string | string[]) => {
            const action = BoardAction.updateBoardFilter({
                filter: filter,
                board_id: board.id,
                value: value,
            });
            return dispatch(action);
        },
        [board.id]
    );

    const createCardTemplate = useCallback(
        (
            name: string,
            desc: string,
            fields: { name: string; type: string }[]
        ) => {
            const action = BoardAction.createCardTemplate({
                board_id: board.id,
                params: {
                    name,
                    fields,
                    description: desc,
                },
            });
            return dispatch(action);
        },
        [board.id]
    );

    const deleteCardTemplate = useCallback(
        (id: string) => {
            const action = BoardAction.deleteCardTemplate({
                board_id: board.id,
                template_id: id,
            });
            return dispatch(action);
        },
        [board.id]
    );

    const createLabel = useCallback(
        (params: BoardAction.CreateLabelParams) => {
            const action = BoardAction.createLabel(board.id, params);
            return dispatch(action);
        },
        [board.id]
    );
    const updateLabel = useCallback(
        (id: string, params: Partial<BoardAction.CreateLabelParams>) => {
            const action = BoardAction.updateLabel({
                params,
                label_id: id,
                board_id: board.id,
            });
            return dispatch(action);
        },
        [board.id]
    );

    const deleteLabel = useCallback(
        (id: string) => {
            const action = BoardAction.deleteLabel({
                board_id: board.id,
                label_id: id,
            });
            return dispatch(action);
        },
        [board.id]
    );
    return {
        updateBoard,
        filter,
        createLabel,
        updateLabel,
        deleteLabel,
        createCardTemplate,
        deleteCardTemplate,
    };
}

export function useCollectionActions(collection: CollectionRecord) {
    const dispatch = useDispatch();

    const update = useCallback(
        (
            params: Omit<
                BoardAction.UpdateCollectionPayload,
                "collection_id" | "board_id"
            >
        ) => {
            const action = BoardAction.updateCollection({
                ...params,
                collection_id: collection.id,
                board_id: collection.board_id,
            });
            return dispatch(action);
        },
        [collection.id]
    );

    const destroy = useCallback(() => {
        const action = BoardAction.deleteCollection({
            collection_id: collection.id,
            board_id: collection.board_id,
        });
        return dispatch(action);
    }, []);

    const stash = useCallback(() => {
        const action = BoardAction.archiveCollection({
            collection_id: collection.id,
            board_id: collection.board_id,
        });
        return dispatch(action);
    }, []);

    const unstash = useCallback(() => {
        const action = BoardAction.unarchiveCollection({
            collection_id: collection.id,
            board_id: collection.board_id,
        });
        return dispatch(action);
    }, []);

    const createCard = useCallback((name: string, template?: string) => {
        const action = BoardAction.createCard({
            params: {
                name: name,
            },
            template_id: template,
            board_id: collection.board_id,
            collection_id: collection.id,
        });
        return dispatch(action);
    }, []);

    return {
        update,
        destroy,
        stash,
        unstash,
        createCard,
    };
}

export function useFieldAction(field: CardFieldRecord) {
    const dispatch = useDispatch();

    const assignUser = useCallback(
        (user_id: string) => {
            const action = BoardAction.assignChecklist({
                field_id: field.id,
                card_id: field.card_id,
                user_id: user_id,
            });
            return dispatch(action);
        },
        [field.id]
    );
    const unassignUser = useCallback(
        (user_id: string) => {
            const action = BoardAction.unassignChecklist({
                field_id: field.id,
                card_id: field.card_id,
                user_id: user_id,
            });
            return dispatch(action);
        },
        [field.id]
    );
    const setFieldValue = useCallback(
        (value: any) => {
            const action = BoardAction.setCardFieldValue({
                field_id: field.id,
                card_id: field.card_id,
                params: {
                    value: value,
                },
            });
            return dispatch(action);
        },
        [field.id]
    );

    const deleteFieldValue = useCallback(
        (id: string) => {
            const action = BoardAction.deleteCardFieldValue({
                value_id: id,
                field_id: field.id,
                card_id: field.card_id,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const createFieldValue = useCallback(
        (params: { [key: string]: any }) => {
            const action = BoardAction.createCardFieldValue({
                field_id: field.id,
                card_id: field.card_id,
                params: params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const updateFieldValue = useCallback(
        (id: string, params: { [key: string]: any }) => {
            const action = BoardAction.updateCardFieldValue({
                field_id: field.id,
                value_id: id,
                card_id: field.card_id,
                params: params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const updateField = useCallback(
        (params: { name?: string }) => {
            const action = BoardAction.updateCardField({
                field_id: field.id,
                card_id: field.card_id,
                params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const deleteField = useCallback(() => {
        const action = BoardAction.deleteCardField({
            field_id: field.id,
            card_id: field.card_id,
        });
        return dispatch(action);
    }, [field.id]);

    return {
        updateField,
        deleteField,
        setFieldValue,
        assignUser,
        unassignUser,
        updateFieldValue,
        createFieldValue,
        deleteFieldValue,
    };
}

export function useCardActions(card: CardRecord) {
    const dispatch = useDispatch();

    const destroyCard = useCallback(() => {
        const action = BoardAction.delelteCard({
            board_id: card.board_id,
            card_id: card.id,
        });
        return dispatch(action);
    }, [card.id]);

    const createField = useCallback(
        (params: {
            name: string;
            type: string;
            metadata?: { [key: string]: any };
        }) => {
            const action = BoardAction.createCardField({
                card_id: card.id,
                board_id: card.board_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const moveField = useCallback((id: string, index: number) => {
        const action = BoardAction.moveCardField({
            field_id: id,
            card_id: card.id,
            params: {
                index: index,
            },
        });
        return dispatch(action);
    }, []);

    const updateField = useCallback(
        (field_id: string, params: { name?: string }) => {
            const action = BoardAction.updateCardField({
                field_id,
                card_id: card.id,
                board_id: card.board_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const deleteCardField = useCallback((id: string) => {
        const action = BoardAction.deleteCardField({
            field_id: id,
            card_id: card.id,
        });
        return dispatch(action);
    }, []);

    const archiveCard = useCallback(() => {
        const params = {
            board_id: card.board_id,
            card_id: card.id,
        };
        const action = BoardAction.archiveCard(params);
        return dispatch(action);
    }, [card.id]);

    const moveCard = useCallback(
        (id: string) => {
            if (id != card.collection_id) {
                const params = {
                    card_id: card.id,
                    collection_id: id,
                    board_id: card.board_id,
                };
                const action = BoardAction.moveCard(params);
                return dispatch(action);
            } else {
                return Promise.resolve(card);
            }
        },
        [card.id, card.collection_id]
    );

    const updateCard = useCallback(
        (params: { name: string }) => {
            const payload = {
                params,
                board_id: card.board_id,
                card_id: card.id,
            };
            const action = BoardAction.updateCard(payload);
            return dispatch(action);
        },
        [card.id]
    );

    const completeCard = useCallback(() => {
        const action = BoardAction.completeCard({
            board_id: card.board_id,
            card_id: card.id,
        });
        return dispatch(action);
    }, [card.id]);

    const uncompleteCard = useCallback(() => {
        const action = Actions.Board.uncompleteCard({
            board_id: card.board_id,
            card_id: card.id,
        });
        return dispatch(action);
    }, [card.id]);

    const actions = {
        createField,
        updateField,
        moveField,
        uncompleteCard,
        destroyCard,
        updateCard,
        completeCard,
        archiveCard,
        moveCard,
        deleteCardField,
    };

    return useMemo(() => {
        return actions;
    }, Object.values(actions));
}
