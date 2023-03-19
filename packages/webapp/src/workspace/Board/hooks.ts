import { CardRecord, CollectionRecord } from "@colab/store";
import { OrderedMap } from "immutable";
import { useContext, useCallback } from "react";
import * as BoardAction from "@colab/store/lib/actions/board";
import Context, { Cards, Dragged } from "./Context";
import { useDispatch } from "react-redux";
import { useDrawer as useWorkspaceDrawer } from "src/hooks";
import {
    useBoardCollections,
    useLabels as useStoreLabels,
    useSpace as useStoreSpace,
    Actions,
} from "@colab/store";
export { useMembers, useMember } from "../Space/hooks";
export { useCardActions, useFieldAction } from "../Card/hooks";

const defaultCards = OrderedMap<string, CardRecord>();

export interface IDrawer {
    type: string;
    card_id?: string;
    user_id?: string;
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
    return useStoreLabels(useBoard().space_id);
}

export function useSpace() {
    return useStoreSpace(useBoard().space_id);
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
    return useBoardCollections(board.space_id);
}

export function useBoardActions() {
    const board = useBoard();
    const dispatch = useDispatch();

    const filter = useCallback(
        (filter: string, value: string | string[]) => {
            const action = Actions.Board.updateBoardFilter({
                filter: filter,
                space_id: board.space_id,
                value: value,
            });
            return dispatch(action);
        },
        [board.space_id]
    );

    const createCardTemplate = useCallback(
        (
            name: string,
            desc: string,
            fields: { name: string; type: string }[]
        ) => {
            const action = Actions.Board.createCardTemplate({
                space_id: board.space_id,
                params: {
                    name,
                    fields,
                    description: desc,
                },
            });
            return dispatch(action);
        },
        [board.space_id]
    );

    const deleteCardTemplate = useCallback(
        (id: string) => {
            const action = Actions.Board.deleteCardTemplate({
                space_id: board.space_id,
                template_id: id,
            });
            return dispatch(action);
        },
        [board.space_id]
    );

    const createLabel = useCallback(
        (params: BoardAction.CreateLabelParams) => {
            const action = Actions.Board.createLabel(board.space_id, params);
            return dispatch(action);
        },
        [board.space_id]
    );
    const updateLabel = useCallback(
        (id: string, params: Partial<BoardAction.CreateLabelParams>) => {
            const action = Actions.Board.updateLabel({
                params,
                label_id: id,
                space_id: board.space_id,
            });
            return dispatch(action);
        },
        [board.space_id]
    );

    const deleteLabel = useCallback(
        (id: string) => {
            const action = Actions.Board.deleteLabel({
                space_id: board.space_id,
                label_id: id,
            });
            return dispatch(action);
        },
        [board.space_id]
    );
    return {
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
                "collection_id" | "space_id"
            >
        ) => {
            const action = Actions.Board.updateCollection({
                ...params,
                collection_id: collection.id,
                space_id: collection.space_id,
            });
            return dispatch(action);
        },
        [collection.id]
    );

    const destroy = useCallback(() => {
        const action = Actions.Board.deleteCollection({
            collection_id: collection.id,
            space_id: collection.space_id,
        });
        return dispatch(action);
    }, []);

    const stash = useCallback(() => {
        const action = Actions.Board.archiveCollection({
            collection_id: collection.id,
            space_id: collection.space_id,
        });
        return dispatch(action);
    }, []);

    const unstash = useCallback(() => {
        const action = Actions.Board.unarchiveCollection({
            collection_id: collection.id,
            space_id: collection.space_id,
        });
        return dispatch(action);
    }, []);

    const createCard = useCallback((name: string, template?: string) => {
        const action = Actions.Board.createCard({
            params: {
                name: name,
            },
            template_id: template,
            space_id: collection.space_id,
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
