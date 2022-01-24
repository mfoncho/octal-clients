import { useCallback } from "react";
import * as TopicActions from "@octal/store/lib/actions/topic";
import { useDispatch } from "react-redux";
import { UpdateTopicPayload } from "@octal/store/lib/actions/topic";

interface ITopic {
    id: string;
    space_id: string;
}

export function useActions(topic: ITopic) {
    const dispatch = useDispatch();

    const archiveTopic = useCallback(() => {
        const action = TopicActions.archiveTopic({
            space_id: topic.space_id,
            topic_id: topic.id,
        });
        return dispatch(action);
    }, [topic.id]);

    const unarchiveTopic = useCallback(() => {
        const action = TopicActions.unarchiveTopic({
            space_id: topic.space_id,
            topic_id: topic.id,
        });
        return dispatch(action);
    }, [topic.id]);

    const updateTopic = useCallback(
        (params: Omit<UpdateTopicPayload, "space_id" | "topic_id">) => {
            const action = TopicActions.updateTopic({
                ...params,
                topic_id: topic.id,
                space_id: topic.space_id,
            });
            return dispatch(action);
        },
        [topic.id]
    );

    const deleteTopic = useCallback(() => {
        const action = TopicActions.deleteTopic({
            topic_id: topic.id,
            space_id: topic.space_id,
        });
        return dispatch(action);
    }, [topic.id]);

    return { updateTopic, deleteTopic, archiveTopic, unarchiveTopic };
}
