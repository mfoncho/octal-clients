import React from "react";
import { Text } from "@octal/ui";
import { useUser } from "@octal/store";
import UserCard from "@workspace/UserCard";

export interface IUsername {
    id: string;
}

export default function Username({ id }: IUsername) {
    const user = useUser(id);
    const ref = React.useRef<HTMLSpanElement | null>(null);
    const [card, clickHander] = UserCard.useCard(user.id);

    function handleClick(e: any) {
        if (ref.current == e.target) {
            clickHander(e);
        }
    }
    return (
        <span
            role="button"
            ref={ref}
            onClick={handleClick}
            className="px-1 pb-0.5 my-0.5 bg-primary-500 text-white rounded-full font-semibold text-sm">
            @<Text>{user.username}</Text>
            {card}
        </span>
    );
}
