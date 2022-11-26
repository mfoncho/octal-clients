import React from "react";
import { List } from "immutable";
import * as Icons from "@colab/icons";
import { Tooltip, Text } from "@colab/ui";
import Label from "@workspace/Board/Label";
import { useUser } from "@colab/store";

interface IUserAvatar {
    id: string;
    className?: string;
}

interface ICard {
    name: string;
    complete: boolean;
    checklists: List<string>;
    users:
        | List<string>
        | List<{ id: string; avatar_url: string; username: string }>;
    labels: List<{ id: string; name: string; color: string }>;
    dragHandle?: any;
    onClick?: (e: React.MouseEvent) => void;
}

export const Avatar = React.memo<{
    alt: string;
    src: string;
    className?: string;
}>((props) => (
    <img
        className={`inline-block rounded-full h-6 w-6 ring-2 ring-white`}
        alt={props.alt}
        src={props.src}
    />
));

export const UserAvatar = React.memo<IUserAvatar>(({ id, className }) => {
    const user = useUser(id);
    return (
        <Avatar alt={user.name} src={user.avatar_url} className={className} />
    );
});

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
                <Icons.Clipboard className="text-gray-500 w-4 h-4" />
                <span className="text-sm px font-semibold">
                    {checklists.size}
                </span>
            </div>
        </Tooltip>
    );
});

export default React.memo<ICard>((props) => {
    return (
        <div
            className="flex bg-white rounded-lg ring-2 ring-gray-200 flex-col justify-between"
            onClick={props.onClick}>
            <div
                {...props.dragHandle}
                className="flex flex-row p-2 justify-between">
                <span className="pr-2 font-semibold">
                    <Text>{props.name}</Text>
                </span>
                {props.complete && (
                    <div className="flex justify-center items-center">
                        <Icons.Complete className="text-green-500 w-5 h-5" />
                    </div>
                )}
            </div>
            {!props.labels.isEmpty() && (
                <div className="py-1 px-2 flex flex-row items-center flex-wrap">
                    {props.labels.map((label) => (
                        <div key={label.id} className="pr-1.5 pb-1.5">
                            <Label name={label.name} color={label.color} />
                        </div>
                    ))}
                </div>
            )}
            {(!props.checklists.isEmpty() || !props.users.isEmpty()) && (
                <div className="flex flex-row px-2 py-1 rounded-b-lg bg-gray-100 items-center justify-between">
                    <div className="flex flex-row items-center">
                        {!props.checklists.isEmpty() && (
                            <Checklists checklists={props.checklists} />
                        )}
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                        {props.users
                            .take(3)
                            .map((user) =>
                                typeof user == "string" ? (
                                    <UserAvatar
                                        id={user}
                                        key={user}
                                        className=""
                                    />
                                ) : (
                                    <Avatar
                                        key={user.id}
                                        src={user.avatar_url}
                                        alt={user.username}
                                    />
                                )
                            )}
                    </div>
                </div>
            )}
        </div>
    );
});
