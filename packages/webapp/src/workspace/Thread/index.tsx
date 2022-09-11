import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useThread, useMessage, ThreadRecord } from "@octal/store";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { Textarea } from "@octal/ui";
import ReplyPreview from "./ReplyPreview";
import { usePostInput } from "./hooks";
import Conversation from "../Conversation";

export interface IThread {
    id: string;
    menu?: string[];
}

const NONE = "NONE";

const defaultThread = new ThreadRecord({ id: NONE });

export default React.memo<IThread>((props) => {
    const dispatch = useDispatch();
    const params = useParams<{ space_id: string }>();
    const thread = useThread(props.id) ?? defaultThread;
    const rmsg = useMessage(thread.draft.reply ?? "");
    const input = usePostInput(thread);

    /**
     * Fetch thread if thread
     * not in store
     */
    useEffect(() => {
        if (thread.id === NONE) {
            const action = ThreadActionFactory.loadThread({
                space_id: params.space_id!,
                thread_id: props.id,
            });
            dispatch(action);
        }
    }, [thread.id]);

    if (thread.id === NONE)
        return <div className="flex flex-col flex-grow"></div>;

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <Conversation key={thread.id} thread={thread} />
            <div className="relative flex flex-col flex-none p-1 sm:p-4 overflow-hidden">
                {rmsg && (
                    <div className="relative w-full -top-1">
                        <ReplyPreview
                            message={rmsg}
                            onClose={() => input.onReply(null)}
                        />
                    </div>
                )}
                {!input.disabled && (
                    <Textarea.Post {...input} key={thread.id} />
                )}
            </div>
        </div>
    );
});
