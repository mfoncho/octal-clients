import React, { useState } from "react";
import { List } from "immutable";
import {
    BiCheckboxChecked as DoneIcon,
    BiCheckbox as UndoneIcon,
} from "react-icons/bi";
import CardDialog from "@workspace/CardDialog";
import { sort } from "@octal/common";
import { Text, Tooltip } from "@octal/ui";
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
    const [dialog, setDialog] = useState(false);

    function handleOpenCard(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setDialog(true);
    }

    function handleCloseCard() {
        setDialog(false);
    }

    const subheader = (
        <div className="inline-flex flex-row">
            <span className="text-sm font-semibold text-gray-500">
                {props.card.name}
            </span>
            <span className="text-xs px-2 text-gray-500">
                (<Text>{props.board.name}</Text>)
            </span>
        </div>
    );
    return (
        <div className="flex flex-col rounded-lg bg-white p-4">
            <div className="flex flex-row justify-between">
                <span
                    onClick={handleOpenCard}
                    role="button"
                    className="cursor-pointer font-bold">
                    {props.name}
                </span>
                <UserAvatar users={props.users} />
            </div>
            {subheader}
            <div className="flex flex-col py-1">
                {props.tasks.map((task) => (
                    <div key={task.id} className="flex flex-row items-center">
                        {task.done ? (
                            <DoneIcon className="h-6 w-6 text-primary-500" />
                        ) : (
                            <UndoneIcon className="h-6 w-6 text-gray-500" />
                        )}

                        <span
                            onClick={handleOpenCard}
                            role="button"
                            className="cursor-pointer px-2 font-semibold text-sm text-gray-500">
                            {task.name}
                        </span>
                    </div>
                ))}
            </div>
            <CardDialog
                open={dialog}
                id={props.card.id}
                onClose={handleCloseCard}
            />
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
