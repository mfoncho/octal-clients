import React, { useState } from "react";
import Layout from "./Layout";
import * as Icons from "@octal/icons";
import { useDispatch } from "react-redux";
import { Dialog } from "@octal/ui";
import { Promiseable } from "@octal/common";
import { useInput } from "src/utils";
import { Text } from "@octal/ui";
import { SpaceManagerFilterParams } from ".";
import { TopicRecord } from "@octal/store/lib/records";
import * as TopicActions from "@octal/store/lib/actions/topic";
import { useSpaceTopics } from "@octal/store";

interface ITopic {
    topic: TopicRecord;
    onDelete?: (topic: TopicRecord) => Promiseable;
    onArchive?: (params: TopicRecord) => Promiseable;
    onUnarchive?: (topic: TopicRecord) => Promiseable;
}

interface IWarning {
    onConfirm: (e: React.MouseEvent) => void;
    title: string;
    confirm: string;
    loading: boolean;
    children: React.ReactNode;
}

function deleteWarningText(topic: any) {
    return `If you delete __${topic.name}__, all mesages, and related data in the topic will be lost permantly. 

###### Are you sure you wish to do this?`;
}

const WarningDialog = Dialog.create<IWarning>((props) => {
    return (
        <Dialog.Warning
            open={props.open}
            title={props.title}
            confirm={props.confirm}
            onClose={props.onClose}
            disabled={props.loading}
            onConfirm={props.onConfirm}>
            {props.children}
        </Dialog.Warning>
    );
});

function Row({ topic, onArchive, onUnarchive, onDelete }: ITopic) {
    const [loading, setLoading] = useState(false);

    const dialog = Dialog.useDialog("");

    function handleDelete() {
        setLoading(true);
        if (onDelete) {
            onDelete(topic).catch(() => setLoading(false));
        }
    }

    function handleArchiveTopic() {
        setLoading(true);
        if (onArchive) {
            onArchive(topic).finally(() => setLoading(false));
        }
    }

    function handleUnarchiveTopic() {
        setLoading(true);
        if (onUnarchive) {
            onUnarchive(topic).finally(() => setLoading(false));
        }
    }

    function renderActions() {
        if (topic.is_main) return null;
        if (topic.is_archived) {
            return (
                <>
                    <button
                        onClick={handleUnarchiveTopic}
                        className="invisible group-hover:visible text-gray-500 rounded-full mx-2 border border-gray-500 p-1 hover:bg-gray-200 flex items-center justify-center">
                        <Icons.Unarchive fontSize="small" />
                    </button>
                    <button
                        onClick={dialog.opener("destroy")}
                        className="invisible group-hover:visible text-gray-500 rounded-full mx-2 border border-gray-500 p-1 hover:bg-gray-200 flex items-center justify-center">
                        <Icons.Delete fontSize="small" />
                    </button>
                </>
            );
        }
        return (
            <button
                onClick={handleArchiveTopic}
                className="invisible group-hover:visible text-gray-500 rounded-full mx-2 border border-gray-500 p-1 hover:bg-gray-200 flex items-center justify-center">
                <Icons.Archive fontSize="small" />
            </button>
        );
    }

    return (
        <div className="flex group px-4 py-2 hover:bg-cool-gray-50 flex-row p-2 items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="mx-2 text-gray-500">
                    <Icons.Topic />
                </div>
                <span className="flex text-base font-semibold text-gray-700 flex-row items-center">
                    <Text>{topic.name}</Text>
                </span>
            </div>
            <div className="invisible group-hover:visible flex flex-row items-center justify-end">
                {renderActions()}
            </div>
            <WarningDialog
                loading={loading}
                title="Delete Topic"
                confirm="Delete"
                onConfirm={handleDelete}
                open={dialog.destroy}
                onClose={dialog.close}>
                {deleteWarningText(topic)}
            </WarningDialog>
        </div>
    );
}

const Manager = React.memo(({ space }: SpaceManagerFilterParams) => {
    const dispatch = useDispatch();

    const topics = useSpaceTopics(space.id);

    const search = useInput("");

    function handleDeleteTopic(topic: TopicRecord) {
        const action = TopicActions.deleteTopic({
            topic_id: topic.id,
            space_id: topic.space_id,
        });
        return dispatch(action);
    }

    function handleArchiveTopic(topic: TopicRecord) {
        const action = TopicActions.archiveTopic({
            topic_id: topic.id,
            space_id: topic.space_id,
        });
        return dispatch(action);
    }

    function handleUnarchiveTopic(topic: TopicRecord) {
        const action = TopicActions.unarchiveTopic({
            topic_id: topic.id,
            space_id: topic.space_id,
        });
        return dispatch(action);
    }

    return (
        <Layout title="Space Topics" className="flex flex-col">
            <div className="flex flex-row pb-4 justify-end">
                <div className="relative flex flex-row item-center">
                    <input
                        className="form-input font-semibold rounded-md text-sm text-gray-800 pl-10 pr-4 border shadow-sm border-gray-300"
                        {...search.props}
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Search className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col py-4 rounded-md bg-cool-gray-100">
                {topics.map((topic) => (
                    <Row
                        key={topic.id}
                        topic={topic}
                        onDelete={handleDeleteTopic}
                        onArchive={handleArchiveTopic}
                        onUnarchive={handleUnarchiveTopic}
                    />
                ))}
            </div>
        </Layout>
    );
});

function filter() {
    return true;
}

const name = "Topics";

export default {
    name: name,
    icon: Icons.Topic,
    filter: filter,
    manager: Manager,
};
