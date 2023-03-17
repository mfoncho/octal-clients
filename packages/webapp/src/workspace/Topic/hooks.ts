import { useCallback } from "react";
import { Actions } from "@colab/store";
import { useDispatch } from "react-redux";

interface IThread {
    id: string;
    space_id: string;
}

interface SearchParams {
    page?: number;
    query: string;
    users?: string[];
    before?: string;
    after?: string;
}

export function useActions(topic: IThread) {
    const dispatch = useDispatch();

    const searchThread = useCallback(
        (params: SearchParams) => {
            const action = Actions.Thread.searchThread({
                params: params,
                space_id: topic.space_id,
                thread_id: topic.id,
            });
            return dispatch(action);
        },
        [topic.id]
    );

    const updateFilter = useCallback(
        (type: string, value: string | string[]) => {
            const action = Actions.Thread.updateThreadSearchFilter(
                topic.id,
                type,
                value
            );
            return dispatch(action);
        },
        [topic.id]
    );

    const archiveThread = useCallback(() => {
        const action = Actions.Thread.archiveThread({
            space_id: topic.space_id,
            thread_id: topic.id,
        });
        return dispatch(action);
    }, [topic.id]);

    const unarchiveThread = useCallback(() => {
        const action = Actions.Thread.unarchiveThread({
            space_id: topic.space_id,
            thread_id: topic.id,
        });
        return dispatch(action);
    }, [topic.id]);

    const renameThread = useCallback(
        (name: string) => {
            const action = Actions.Thread.renameThread({
                params: {name},
                thread_id: topic.id,
                space_id: topic.space_id,
            });
            return dispatch(action);
        },
        [topic.id]
    );

    const deleteThread = useCallback(() => {
        const action = Actions.Thread.deleteThread({
            thread_id: topic.id,
            space_id: topic.space_id,
        });
        return dispatch(action);
    }, [topic.id]);

    return {
        searchThread,
        renameThread,
        updateFilter,
        deleteThread,
        archiveThread,
        unarchiveThread,
    };
}
