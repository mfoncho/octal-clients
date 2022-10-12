import React, { useState, HTMLAttributes } from "react";
import clx from "classnames";
import { useUser } from "@colab/store";

export interface IUserItem extends HTMLAttributes<HTMLDivElement> {
    id: string;
    selected?: boolean;
}

export default function UserItem({
    id,
    selected,
    className = "",
    ...props
}: IUserItem) {
    const user = useUser(id);

    if (user) {
        return (
            <div
                className={clx(
                    "flex flex-row p-1 items-center hover:bg-primary-600 hover:text-white text-gray-500 font-semibold",
                    className
                )}
                {...props}>
                <img
                    className="inline-block mx-3 h-8 w-8 rounded-full bg-primary-500"
                    src={user.avatar}
                />
                {selected ? (
                    <span className="text-primary-800 truncate">
                        {user.name}
                    </span>
                ) : (
                    <span className="truncate">{user.name}</span>
                )}
            </div>
        );
    } else {
        return null;
    }
}
