import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import clx from "classnames";
import client, { io } from "@octal/client";
import * as Icons from "@octal/icons";
import { useDispatch } from "react-redux";
import { Dialog } from "@octal/ui";
import { Promiseable } from "@octal/common";
import { useInput } from "src/utils";
import { Text } from "@octal/ui";
import { SpaceManagerFilterParams } from ".";
import { Actions } from "@octal/store";

interface ITopic {
    topic: io.Topic;
    onDelete?: (topic: string) => Promiseable;
    onArchive?: (params: string) => Promiseable;
    onUnarchive?: (topic: string) => Promiseable;
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

function Topic({ topic, onArchive, onUnarchive, onDelete }: ITopic) {
    const [loading, setLoading] = useState(false);

    const dialog = Dialog.useDialog("");

    function handleDelete() {
        setLoading(true);
        if (onDelete) {
            onDelete(topic.id).catch(() => setLoading(false));
        }
    }

    function handleArchiveTopic() {
        setLoading(true);
        if (onArchive) {
            onArchive(topic.id).finally(() => setLoading(false));
        }
    }

    function handleUnarchiveTopic() {
        setLoading(true);
        if (onUnarchive) {
            onUnarchive(topic.id).finally(() => setLoading(false));
        }
    }

    function renderActions() {
        if (topic.is_archived) {
            return (
                <div className="flex flex-row space-x-2 items-center">
                    <button
                        disabled={topic.is_main}
                        onClick={dialog.opener("destroy")}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Delete className="h-5 w-5" />
                    </button>
                    <button
                        disabled={topic.is_main}
                        onClick={handleUnarchiveTopic}
                        className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                        <Icons.Unarchive className="h-5 w-5" />
                    </button>
                </div>
            );
        }
        return (
            <button
                disabled={topic.is_main}
                onClick={handleArchiveTopic}
                className="text-gray-500 rounded-md border border-slate-200 p-1 hover:bg-slate-300 flex items-center justify-center">
                <Icons.Archive className="h-5 w-5" />
            </button>
        );
    }

    return (
        <div className="flex group px-4 py-3 hover:bg-slate-100 flex-row items-center justify-between">
            <div className="flex flex-row items-center">
                <div className="mx-2 text-gray-500">
                    <Icons.Topic />
                </div>
                <span className="flex text-base font-semibold text-gray-700 flex-row items-center">
                    <Text>{topic.name}</Text>
                </span>
            </div>
            <div
                className={clx(
                    "flex flex-row items-center justify-end",
                    topic.is_main && "invisible"
                )}>
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

    const [topics, setTopics] = React.useState<io.Topic[]>([]);

    const search = useInput("");

    useEffect(() => {
        client.fetchTopics(space.id, { archived: true }).then(setTopics);
    }, []);

    function handleDeleteTopic(id: string) {
        const action = Actions.Topic.deleteTopic({
            topic_id: id,
            space_id: space.id,
        });
        return dispatch(action).then(() => {
            setTopics((topics) => topics.filter((topic) => topic.id !== id));
        });
    }

    function handleArchiveTopic(id: string) {
        const action = Actions.Topic.archiveTopic({
            topic_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((topic) => {
            setTopics((topics) =>
                topics.map((stopic) => (stopic.id == topic.id ? topic : stopic))
            );
        });
    }

    function handleUnarchiveTopic(id: string) {
        const action = Actions.Topic.unarchiveTopic({
            topic_id: id,
            space_id: space.id,
        });
        return dispatch(action).then((topic) => {
            setTopics((topics) =>
                topics.map((stopic) => (stopic.id == topic.id ? topic : stopic))
            );
        });
    }

    function renderTopic(topic: io.Topic) {
        return (
            <Topic
                key={topic.id}
                topic={topic}
                onDelete={handleDeleteTopic}
                onArchive={handleArchiveTopic}
                onUnarchive={handleUnarchiveTopic}
            />
        );
    }

    return (
        <Layout title="Topics" className="flex flex-col">
            <div className="flex flex-row pb-4 justify-end">
                <div className="relative flex flex-row item-center">
                    <input
                        className="form-input font-semibold rounded-md text-sm text-gray-800 pl-9 pr-4 border shadow-sm border-gray-300"
                        {...search.props}
                    />
                    <div className="absolute px-2 h-full flex flex-col justify-center">
                        <Icons.Filter className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-md border-gray-200 border divide-y divide-solid">
                {search.valid
                    ? topics
                          .filter((topic) => topic.name.includes(search.value))
                          .map(renderTopic)
                    : topics.map(renderTopic)}
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
    filter: filter,
    manager: Manager,
};
