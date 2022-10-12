import React from "react";
import clx from "classnames";
import { useUnreadCount } from "@colab/store";
export default React.memo<{ id: string }>((props) => {
    let count = useUnreadCount(props.id);
    return (
        <span
            className={clx(
                "w-4 h-4 text-white rounded-md bg-red-500 flex items-center justify-center text-xs",
                { ["invisible"]: count < 1 }
            )}>
            {count}
        </span>
    );
});
