import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useThread } from "@octal/store";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { Textarea } from "@octal/ui";
import { usePostInput } from "../Space/hooks";
import Conversation from "../Conversation";

interface IThread {
    id: string;
}

export default React.memo<IThread>(({ id }) => {
    const thread = useThread(id);
    const dispatch = useDispatch();
    const postInput = usePostInput(id);
    const params = useParams<{ space_id: string }>();

    /**
     * Fetch thread if thread
     * not in store
     */
    useEffect(() => {
        if (thread == null) {
            const action = ThreadActionFactory.loadThread({
                space_id: params.space_id!,
                thread_id: id,
            });
            dispatch(action);
        }
    }, [thread?.id]);

    if (thread == null) return <div className="flex flex-col flex-grow"></div>;

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <Conversation thread={thread} />

            <div className="flex flex-col flex-none p-1 sm:p-4">
                <Textarea.Post
                    {...postInput}
                    upload={undefined}
                    placeholder=""
                />
            </div>
        </div>
    );
});
