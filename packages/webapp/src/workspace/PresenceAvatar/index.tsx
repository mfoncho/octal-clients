import React from "react";
import clx from "classnames";
import { useUser, usePresence } from "@colab/store";

export default React.memo<React.ImgHTMLAttributes<HTMLImageElement>>(
    ({ className, id, ...props }) => {
        const user = useUser(id);

        const presence = usePresence(user.id);

        return (
            <div className="relative">
                <img
                    src={user.avatar}
                    className={clx(
                        "relative rounded-full",
                        className,
                        "w-10 h-10"
                    )}
                    alt={props.alt || presence.state}
                    {...props}
                />
                <div
                    className={clx(
                        "w-2 h-2 rounded-full ring-2 ring-white absolute right-1 top-1",
                        `bg-presence-${presence.state}`
                    )}
                />
            </div>
        );
    }
);
