import React from "react";
import { List } from "immutable";
import DoneIcon from "@material-ui/icons/CheckCircle";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Tooltip } from "@octal/ui";
import Label from "@workspace/Board/Label";
import { CardRecord, useUser, useBoard } from "@octal/store";

interface IUserAvatar {
    id: string;
    tooltip?: boolean;
    className?: string;
}

interface IComplete {
    complete: boolean;
}

interface ICard {
    card: CardRecord;
    dragHandle?: any;
    onClick?: (e: React.MouseEvent) => void;
}

export const Complete = React.memo<IComplete>(({ complete }) => {
    if (complete) {
        const title = <span className="font-semibold text-sm">completed</span>;

        return (
            <Tooltip placement="top" title={title}>
                <DoneIcon className="mt-1 mr-2.5 text-green-500" />
            </Tooltip>
        );
    } else {
        return <React.Fragment />;
    }
});

export const UserAvatar = React.memo<IUserAvatar>(
    ({ id, tooltip, className }) => {
        const user = useUser(id);
        const image = (
            <img
                className={`inline-block rounded-full ${
                    className ?? "h-8 w-8"
                }`}
                alt={user.username}
                src={user.avatar}
            />
        );
        if (tooltip) {
            const title = (
                <span className="font-semibold text-sm">{user.username}</span>
            );

            return (
                <Tooltip placement="top" title={title}>
                    {image}
                </Tooltip>
            );
        }
        return image;
    }
);

interface IChecklists {
    checklists: List<string>;
}

const Checklists = React.memo<IChecklists>(({ checklists }) => {
    const title = checklists.map((name, index) => (
        <div key={String(index)} className="flex items-center flex-row">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-sm font-semibold px-1">{name}</span>
        </div>
    ));

    return (
        <Tooltip placement="top" title={title}>
            <div className="flex flex-row items-center">
                <AssignmentIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm px font-semibold">
                    {checklists.size}
                </span>
            </div>
        </Tooltip>
    );
});

export default React.memo<ICard>(({ card, ...props }) => {
    const blabel = useBoard(card.board_id)
        .labels.toMap()
        .mapKeys((_index, val) => val.id);

    const labels = card.labels
        .map((val) => blabel.get(val)!)
        .filter(Boolean)
        .toList();

    const checklists = card.fields
        .filter((field) => field.type == "checklist")
        .map((field) => field.name);

    const users = card.users.filter((id) => card.user_id !== id);

    return (
        <div
            className="flex bg-white rounded-lg ring-2 ring-gray-200 flex-col justify-between"
            onClick={props.onClick}>
            <div
                {...props.dragHandle}
                className="flex flex-row p-2 justify-between">
                <div className="flex flex-row">
                    <UserAvatar tooltip={true} id={card.user_id} />
                    <div className="flex flex-col justify-center">
                        <span className="px-2 font-semibold">{card.name}</span>
                    </div>
                </div>
                <Complete complete={card.complete} />
            </div>
            {!labels.isEmpty() && (
                <div className="py-1 px-2 flex flex-row items-center flex-wrap">
                    {labels.map((label) => (
                        <div key={label.id} className="pr-1.5 pb-1.5">
                            <Label
                                icon={label.icon}
                                name={label.name}
                                color={label.color}
                            />
                        </div>
                    ))}
                </div>
            )}
            {(!checklists.isEmpty() || !users.isEmpty()) && (
                <div className="flex flex-row px-4 py-1 rounded-b-lg bg-gray-100 items-center justify-between">
                    <div className="flex flex-row items-center">
                        {!checklists.isEmpty() && (
                            <Checklists checklists={checklists} />
                        )}
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                        {users.take(3).map((uid) => (
                            <UserAvatar
                                key={uid}
                                id={uid}
                                className="h-6 w-6 rounded-full ring-2 ring-white"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
