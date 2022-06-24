import React, { useState } from "react";
import { List } from "immutable";
import * as Icons from "@octal/icons";
import { sort } from "@octal/common";
import { Text, Tooltip } from "@octal/ui";
import paths from "src/paths";
import { Link, generatePath } from "react-router-dom";
import {
    CardTaskValueRecord,
    useUserChecklists,
    CardRecord,
    BoardRecord,
    UserRecord,
    useAuthId,
} from "@octal/store";

interface ICard {
    id: string;
    board: BoardRecord;
    card: CardRecord;
    tasks: List<CardTaskValueRecord>;
    users: List<UserRecord>;
    name: string;
}

interface IUserAvatar {
    users: List<UserRecord>;
}

const createdAtSort = sort("created_at", "desc");

export const UserAvatar = React.memo<IUserAvatar>(({ users }) => {
    const avatars = users.map((user) => (
        <img
            key={user.id}
            className="inline-block rounded-full h-6 w-6 rounded-full ring-2 ring-white"
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

function Checklist(props: ICard) {
    const cardPath = generatePath(paths.workspace.card, {
        board_id: props.board.id,
        space_id: props.board.space_id,
        card_id: props.card.id,
    });

    const subheader = (
        <Link to={cardPath} className="inline-flex flex-row">
            <span className="text-sm font-semibold text-gray-500">
                <Text>{props.card.name}</Text>
            </span>
            <span className="text-xs px-2 text-gray-500">
                (<Text>{props.board.name}</Text>)
            </span>
        </Link>
    );

    return (
        <div className="flex flex-col rounded-lg bg-white p-4">
            <div className="flex flex-row justify-between">
                <span className="cursor-pointer font-bold">
                    <Text>{props.name}</Text>
                </span>
                <UserAvatar users={props.users} />
            </div>
            {subheader}
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
    const checklists = useUserChecklists(id);
    if (checklists.isEmpty()) return <div />;
    return (
        <div className="flex flex-col bg-gray-100 p-4 border-2 border-gray-300 rounded-lg space-y-4">
            {checklists.sort(createdAtSort).map((checklist) => {
                return (
                    <Checklist
                        users={checklist.users}
                        tasks={checklist.tasks}
                        board={checklist.board}
                        id={checklist.id}
                        card={checklist.card}
                        name={checklist.name}
                        key={checklist.id}
                    />
                );
            })}
        </div>
    );
});
