import { Record, Map, List } from "immutable";
import * as Actions from "../actions/types";
import * as TopicActions from "../actions/topic";
import * as SpaceActions from "../actions/space";
import { TopicRecord } from "../records";

export class TopicsStore extends Record({
    spaces: Map<string, List<string>>(),
    entities: Map<string, TopicRecord>(),
}) {
    contains(id: string) {
        return this.entities.has(id);
    }
    getTopic(id: string) {
        return this.entities.get(id);
    }
    removeSpaceTopics(id: string) {
        let tids = this.spaces.get(id);
        if (tids) {
            return tids.reduce((store, id) => {
                return store.removeTopic(id);
            }, this);
        }
        return this;
    }

    updateFilter(payload: TopicActions.TopicFilterUpdatedPayload) {
        const topic = this.getTopic(payload.topic_id);
        if (topic) {
            return this.setIn(
                ["entities", payload.topic_id],
                topic.updateFilter(payload.type, payload.value)
            );
        }
        return this;
    }

    putTopic(payload: any) {
        if (this.contains(payload.id)) {
            return this;
        } else {
            const topic = TopicRecord.make(payload);
            return this.withMutations((store) => {
                store.setIn(["entities", payload.id], topic);

                // index space_id
                let topics = store.spaces.get(topic.space_id, List<string>());
                if (!topics.includes(topic.id))
                    store.setIn(
                        ["spaces", topic.space_id],
                        topics.push(topic.id)
                    );
            });
        }
    }
    patchTopic(payload: any) {
        if (!this.contains(payload.id)) {
            return this;
        } else {
            const topic = this.entities.get(payload.id)!;
            const updated = topic.patch(payload);
            return this.setIn(["entities", topic.id], updated);
        }
    }

    removeTopic(id: string) {
        if (!this.contains(id)) {
            return this;
        } else {
            const topic = this.entities.get(id)!;
            return this.withMutations((store) => {
                const filter = (id: string) => id !== topic.id;

                // index user_id
                let topics = store.spaces.get(topic.space_id, List<string>());
                if (topics.includes(topic.id)) {
                    store.setIn(
                        ["spaces", topic.space_id],
                        topics.filter(filter)
                    );
                }

                store.deleteIn(["entities", topic.id]);
            });
        }
    }
}

export const state = new TopicsStore();

export const reducers = {
    [Actions.LOGGED_OUT](_store: any, _action: any) {
        return state;
    },
    [Actions.TOPIC_FILTER_UPDATED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicFilterUpdatedAction
    ) => {
        return store.updateFilter(payload);
    },
    [Actions.TOPIC_CREATED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicCreatedAction
    ) => {
        return store.putTopic(payload);
    },
    [Actions.TOPIC_LOADED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicLoadedAction
    ) => {
        return store.putTopic(payload);
    },
    [Actions.TOPICS_LOADED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicsLoadedAction
    ) => {
        return payload.reduce((store, topic) => {
            return store.putTopic(topic);
        }, store);
    },
    [Actions.SPACE_PURGED]: (
        store: TopicsStore,
        { payload }: SpaceActions.SpacePurgedAction
    ) => {
        return store.removeSpaceTopics(payload.space_id);
    },
    [Actions.TOPIC_UPDATED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicUpdatedAction
    ) => {
        return store.patchTopic(payload);
    },
    [Actions.TOPIC_ARCHIVED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicArchivedAction
    ) => {
        return store.patchTopic(payload);
    },
    [Actions.TOPIC_UNARCHIVED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicUnarchivedAction
    ) => {
        return store.patchTopic(payload);
    },
    [Actions.TOPIC_PURGED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicPurgedAction
    ) => {
        return store.removeTopic(payload.id);
    },
    [Actions.TOPIC_DELETED]: (
        store: TopicsStore,
        { payload }: TopicActions.TopicDeletedAction
    ) => {
        return store.removeTopic(payload.id);
    },
};

export default { state, reducers };
