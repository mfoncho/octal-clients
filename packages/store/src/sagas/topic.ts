import { put, takeEvery, all } from "redux-saga/effects";
import Client, { io } from "@octal/client";
import { dispatch } from "..";
import { RelatedLoadedAction } from "../actions/app";
import * as TopicActions from "../actions/topic";
import * as SpaceActions from "../actions/space";
import * as Actions from "../actions/types";
import { TopicSchema } from "../schemas";
import * as AppActions from "../actions/app";

function* archive({
    payload,
    resolve: meta,
}: TopicActions.ArchiveTopicAction): Iterable<any> {
    try {
        const data = (yield Client.archiveTopic(payload)) as any;
        yield put(TopicActions.topicArchived(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* unarchive({
    payload,
    resolve: meta,
}: TopicActions.UnarchiveTopicAction): Iterable<any> {
    try {
        const data = (yield Client.unarchiveTopic(payload)) as any;
        yield put(TopicActions.topicUnarchived(data));
        meta.success(data);
    } catch (e) {
        meta.error(e);
    }
}

function* create({
    payload,
    resolve,
}: TopicActions.CreateTopicAction): Iterable<any> {
    try {
        const data = (yield Client.createTopic(payload)) as any;
        yield put(TopicActions.topicCreated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* update({
    payload,
    resolve,
}: TopicActions.UpdateTopicAction): Iterable<any> {
    try {
        const data = (yield Client.updateTopic(payload)) as any;
        yield put(TopicActions.topicUpdated(data));
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* trash({
    payload,
    resolve,
}: TopicActions.DeleteTopicAction): Iterable<any> {
    try {
        const data = (yield Client.deleteTopic(payload)) as any;
        yield put(
            TopicActions.topicDeleted({
                id: payload.topic_id,
                space_id: payload.space_id,
            })
        );
        resolve.success(data);
    } catch (e) {
        resolve.error(e);
    }
}

function* load(topics: io.Topic[]): Iterable<any> {
    let actions = topics.map((topic) => {
        return put(TopicActions.topicLoaded(topic));
    });
    yield all(actions);
}

function* related({ payload }: RelatedLoadedAction): Iterable<any> {
    let topics = Object.values(
        payload[TopicSchema.collect] || {}
    ) as io.Topic[];
    yield* load(topics);
}

function* loadSpaceTopics({
    payload,
}: TopicActions.LoadSpaceTopicsAction): Iterable<any> {
    //@ts-ignore
    const topics: io.Topic[] = yield Client.fetchTopics(payload.id);
    yield* load(topics);
    yield put(AppActions.collectionLoaded(payload.id, "topics", topics));
}

function* spaceLoaded({
    payload,
}: SpaceActions.SpaceLoadedAction): Iterable<any> {
    yield put(TopicActions.loadSpaceTopics(payload.id!));
}

function* subscribe({ payload }: SpaceActions.SpaceConnectedAction) {
    const { channel } = payload;
    channel.on("topic.created", (payload: io.Topic) => {
        dispatch(TopicActions.topicCreated(payload));
    });

    channel.on("topic.updated", (payload: io.Topic) => {
        dispatch(TopicActions.topicUpdated(payload));
    });

    channel.on("topic.deleted", (payload: io.Topic) => {
        dispatch(TopicActions.topicDeleted(payload));
    });
}

export const tasks = [
    { effect: takeEvery, type: Actions.SPACE_CONNECTED, handler: subscribe },
    { effect: takeEvery, type: Actions.SPACE_LOADED, handler: spaceLoaded },
    { effect: takeEvery, type: Actions.LOAD_TOPICS, handler: loadSpaceTopics },
    { effect: takeEvery, type: Actions.RELATED_LOADED, handler: related },
    { effect: takeEvery, type: Actions.ARCHIVE_TOPIC, handler: archive },
    { effect: takeEvery, type: Actions.UNARCHIVE_TOPIC, handler: unarchive },
    { effect: takeEvery, type: Actions.CREATE_TOPIC, handler: create },
    { effect: takeEvery, type: Actions.UPDATE_TOPIC, handler: update },
    { effect: takeEvery, type: Actions.DELETE_TOPIC, handler: trash },
];
