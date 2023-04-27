import React from "react";
import { List } from "immutable";
import * as Icons from "@colab/icons";
import { sort } from "@colab/common";
import { Text, Image, Tooltip } from "@colab/ui";
import paths from "src/paths";
import { Link, generatePath } from "react-router-dom";
import {
    RecordTaskValueRecord,
    useUserChecklists,
    RecordRecord,
    CatalogRecord,
    UserRecord,
    useAuthId,
} from "@colab/store";

interface IRecord {
    id: string;
    catalog: CatalogRecord;
    record: RecordRecord;
    tasks: List<RecordTaskValueRecord>;
    users: List<UserRecord>;
    name: string;
}

interface IUserAvatar {
    users: List<UserRecord>;
}

const createdAtSort = sort("created_at", "desc");

export const UserAvatar = React.memo<IUserAvatar>(({ users }) => {
    const avatars = users.map((user) => (
        <Image
            key={user.id}
            className="inline-block rounded-lg h-6 w-6 rounded-full ring-2 ring-white"
            alt={user.username}
            src={user.avatar}
        />
    ));
    const usernames = users.map((user) => (
        <div key={user.id}>
            <span className="font-semibold text-sm">{user.username}</span>
        </div>
    ));

    return (
        <Tooltip
            placement="top"
            title={<div className="block p-1">{usernames}</div>}>
            <div className="flex -space-x-2 overflow-hidden">{avatars}</div>
        </Tooltip>
    );
});

function Checklist(props: IRecord) {
    return (
        <div className="flex flex-col px-4 py-2">
            <div className="flex flex-row justify-between">
                <span className="text-sm cursor-pointer font-semibold text-gray-700">
                    <Text>{props.name}</Text>
                </span>
                <UserAvatar users={props.users} />
            </div>
            <div className="flex flex-col py-1">
                {props.tasks.map((task) => (
                    <div key={task.id} className="flex flex-row items-center">
                        {task.done ? (
                            <Icons.Task.DoneSolid className="h-5 w-5 text-primary-500" />
                        ) : (
                            <Icons.Task.Undone className="h-5 w-5 text-gray-500" />
                        )}

                        <span className="cursor-pointer px-2 font-semibold text-sm text-gray-500">
                            <Text>{task.name}</Text>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(function Assigned() {
    const id = useAuthId();
    const checklists = useUserChecklists(id).sort(createdAtSort);
    const grouped = checklists
        .groupBy((checklist) => checklist.record.id)
        .toList();
    if (checklists.isEmpty()) return <div />;
    return (
        <div className="flex flex-col space-y-8">
            {grouped.map((checklists) => {
                let items = checklists.toList();
                let sample = items.first()!;
                const recordPath = generatePath(paths.workspace.record, {
                    catalog_id: sample.catalog.id,
                    space_id: sample.catalog.space_id,
                    record_id: sample.record.id,
                });
                return (
                    <div
                        key={items.first()?.record.id}
                        className="flex flex-col divide-y-2 divide-gray-200 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <Link
                            to={recordPath}
                            className="flex flex-row px-4 py-2 justify-between bg-slate-100 hover:bg-slate-200">
                            <div>
                                <span className="font-bold text-gray-800">
                                    <Text>{sample.record.name}</Text>
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 font-semibold">
                                    <Text>{sample.catalog.name}</Text>
                                </span>
                            </div>
                        </Link>
                        {items.toList().map((checklist) => {
                            return (
                                <Checklist
                                    users={checklist.users}
                                    tasks={checklist.tasks}
                                    catalog={checklist.catalog}
                                    id={checklist.id}
                                    record={checklist.record}
                                    name={checklist.name}
                                    key={checklist.id}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
});
