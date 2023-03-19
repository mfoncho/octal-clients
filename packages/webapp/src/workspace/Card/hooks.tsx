import { Record } from "immutable";
import { useCallback, useContext, useMemo } from "react";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import { CardRecord, useSpace as useStoreSpace, useLabels } from "@colab/store";
import { useDispatch } from "react-redux";
import { Card as CardContext } from "./Context";
import {
    useCard as useBoardCard,
    useAuthId,
    useSpacePermissions,
    CardFieldRecord,
} from "@colab/store";
import { Actions } from "@colab/store";

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
        const action = Actions.Board.delelteCard({
            space_id: card.space_id,
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
            const action = Actions.Board.createCardField({
                card_id: card.id,
                space_id: card.space_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const moveField = useCallback((id: string, index: number) => {
        const action = Actions.Board.moveCardField({
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
            const action = Actions.Board.updateCardField({
                field_id,
                card_id: card.id,
                space_id: card.space_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const deleteCardField = useCallback((id: string) => {
        const action = Actions.Board.deleteCardField({
            field_id: id,
            card_id: card.id,
        });
        return dispatch(action);
    }, []);

    const archiveCard = useCallback(() => {
        const params = {
            space_id: card.space_id,
            card_id: card.id,
        };
        const action = Actions.Board.archiveCard(params);
        return dispatch(action);
    }, [card.id]);

    const moveCard = useCallback(
        (id: string) => {
            if (id != card.collection_id) {
                const params = {
                    card_id: card.id,
                    collection_id: id,
                    space_id: card.space_id,
                };
                const action = Actions.Board.moveCard(params);
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
                space_id: card.space_id,
                card_id: card.id,
            };
            const action = Actions.Board.updateCard(payload);
            return dispatch(action);
        },
        [card.id]
    );

    const completeCard = useCallback(() => {
        const action = Actions.Board.completeCard({
            space_id: card.space_id,
            card_id: card.id,
        });
        return dispatch(action);
    }, [card.id]);

    const uncompleteCard = useCallback(() => {
        const action = Actions.Board.uncompleteCard({
            space_id: card.space_id,
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

export function useCard() {
    return useContext(CardContext);
}

export function useSpace() {
    return useStoreSpace(useCard().space_id);
}

export function useSpaceLabels() {
    return useLabels(useCard().space_id);
}
export function useCardCapability(id: string) {
    const aid = useAuthId();
    const card = useBoardCard(id)!;
    const permissions = useSpacePermissions(card.space_id);
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

export function useFieldAction(field: CardFieldRecord) {
    const dispatch = useDispatch();

    const assignUser = useCallback(
        (user_id: string) => {
            const action = Actions.Board.assignChecklist({
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
            const action = Actions.Board.unassignChecklist({
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
            const action = Actions.Board.setCardFieldValue({
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
            const action = Actions.Board.deleteCardFieldValue({
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
            const action = Actions.Board.createCardFieldValue({
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
            const action = Actions.Board.updateCardFieldValue({
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
            const action = Actions.Board.updateCardField({
                field_id: field.id,
                card_id: field.card_id,
                params,
            });
            return dispatch(action);
        },
        [field.id]
    );

    const deleteField = useCallback(() => {
        const action = Actions.Board.deleteCardField({
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
        const action = Actions.Board.delelteCard({
            space_id: card.space_id,
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
            const action = Actions.Board.createCardField({
                card_id: card.id,
                space_id: card.space_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const moveField = useCallback((id: string, index: number) => {
        const action = Actions.Board.moveCardField({
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
            const action = Actions.Board.updateCardField({
                field_id,
                card_id: card.id,
                space_id: card.space_id,
                params,
            });
            return dispatch(action);
        },
        []
    );

    const deleteCardField = useCallback((id: string) => {
        const action = Actions.Board.deleteCardField({
            field_id: id,
            card_id: card.id,
        });
        return dispatch(action);
    }, []);

    const archiveCard = useCallback(() => {
        const params = {
            space_id: card.space_id,
            card_id: card.id,
        };
        const action = Actions.Board.archiveCard(params);
        return dispatch(action);
    }, [card.id]);

    const moveCard = useCallback(
        (id: string) => {
            if (id != card.collection_id) {
                const params = {
                    card_id: card.id,
                    collection_id: id,
                    space_id: card.space_id,
                };
                const action = Actions.Board.moveCard(params);
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
                space_id: card.space_id,
                card_id: card.id,
            };
            const action = Actions.Board.updateCard(payload);
            return dispatch(action);
        },
        [card.id]
    );

    const completeCard = useCallback(() => {
        const action = Actions.Board.completeCard({
            space_id: card.space_id,
            card_id: card.id,
        });
        return dispatch(action);
    }, [card.id]);

    const uncompleteCard = useCallback(() => {
        const action = Actions.Board.uncompleteCard({
            space_id: card.space_id,
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
