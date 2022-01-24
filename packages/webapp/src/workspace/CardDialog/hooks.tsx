import { useCallback, useMemo } from "react";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { CardRecord } from "@octal/store";
import { useDispatch } from "react-redux";
import * as BoardAction from "@octal/store/lib/actions/board";

export interface IDrawer {
    id: string;
    type: string;
    thread_id?: string;
}

const defaultDrawerProps: IDrawer = {
    id: "",
    type: "",
    thread_id: "",
};

export function useDrawer(id: string) {
    return useWorkspaceDrawer(id, defaultDrawerProps);
}

export function useActions(card: CardRecord) {
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

    const trackEvent = useCallback(
        (event: string) => {
            const action = BoardAction.createTracker({
                entity_id: card.id,
                params: {
                    event,
                },
            });
            return dispatch(action);
        },
        [card.id]
    );

    const untrackEvent = useCallback(
        (event: string) => {
            const action = BoardAction.deleteTracker({
                entity_id: card.id,
                params: {
                    event,
                },
            });
            return dispatch(action);
        },
        [card.id]
    );

    const moveField = useCallback((id: string, position: number) => {
        const action = BoardAction.moveCardField({
            field_id: id,
            card_id: card.id,
            params: {
                position: position,
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
            if (id != card.column_id) {
                const params = {
                    card_id: card.id,
                    column_id: id,
                    board_id: card.board_id,
                };
                const action = BoardAction.moveCard(params);
                return dispatch(action);
            } else {
                return Promise.resolve(card);
            }
        },
        [card.id, card.column_id]
    );

    const updateCard = useCallback(
        (
            params: Omit<BoardAction.UpdateCardPayload, "card_id" | "board_id">
        ) => {
            const payload = {
                ...params,
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
        return Promise.reject("@TODO");
    }, [card.id]);

    const actions = {
        createField,
        updateField,
        trackEvent,
        untrackEvent,
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
