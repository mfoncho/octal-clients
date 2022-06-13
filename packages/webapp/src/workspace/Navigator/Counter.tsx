import React from "react";
import clx from "classnames";
import { useUnreadCount } from "@octal/store";
import { useDispatch } from "react-redux";
import { useThread } from "@octal/store";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";

export default React.memo<{ id: string }>((props) => {
    const dispatch = useDispatch();
    const thread = useThread(props.id);
    let count = useUnreadCount(props.id);
    React.useEffect(() => {
        if (!Boolean(thread)) {
            const action = ThreadActionFactory.loadThread({
                thread_id: props.id,
                space_id: props.id,
            });
            dispatch(action);
        }
    }, [Boolean(thread)]);
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
