import React from "react";
import { Tooltip } from "@colab/ui";
import { useUser } from "@colab/store";

interface IUserAvatar {
    uid: string;
    tooltip?: boolean;
    className?: string;
}

export default React.memo<IUserAvatar>((props) => {
    const user = useUser(props.uid);
    const image = (
        <img
            className={props.className}
            alt={user.username}
            src={user.avatar}
        />
    );
    if (props.tooltip) {
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
});
