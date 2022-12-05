import { Record } from "immutable";
import { useCallback, useMemo } from "react";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { CardRecord } from "@colab/store";
import { useDispatch } from "react-redux";
import {
    useCard as useBoardCard,
    useAuthId,
    useBoard,
    useSpacePermissions,
} from "@colab/store";
import * as BoardAction from "@colab/store/lib/actions/board";

export interface IDrawer {
    id: string;
    type: string;
    thread_id?: string;
}

let CardCap = {
    ["board.manage"]: false,
    ["card.manage"]: false,
    ["card.delete"]: false,
    ["card.track"]: false,
};

export type Can = <T = boolean>(
    permission: keyof typeof CardCap,
    value?: T
) => T;

export class Capability extends Record(CardCap) {}

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
        const action = BoardAction.uncompleteCard({
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

export function useCardCapability(id: string) {
    const aid = useAuthId();
    const card = useBoardCard(id)!;
    const board = useBoard(card.board_id);
    const permissions = useSpacePermissions(board?.space_id);
    return useMemo<Can>(() => {
        const canManageBoard = permissions.get(
            "board.manage",
            false
        ) as boolean;
        let cap = new Capability({
            ["card.track"]: !card.archived,
            ["board.manage"]: canManageBoard && !card.archived,
            ["card.manage"]:
                (card.user_id === aid || canManageBoard) && !card.archived,
            ["card.delete"]: canManageBoard && card.archived,
        });
        return ((permission: keyof typeof CardCap, val?: any) => {
            let perm = cap.get(permission, false);
            if (val === undefined) {
                return perm;
            }
            if (perm) {
                return val;
            }
            return perm;
        }) as Can;
    }, [permissions, card.id, card.archived]);
}
