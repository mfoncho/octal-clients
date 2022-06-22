import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useThread, useMessage, ThreadRecord } from "@octal/store";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { Textarea } from "@octal/ui";
import Menu from "@workspace/Message/Menu";
import ReplyPreview from "./ReplyPreview";
import { usePostInput } from "./hooks";
import Conversation from "../Conversation";

export interface IThread {
    id: string;
    menu?: string[];
}

const defaultThread = new ThreadRecord();

export default React.memo<IThread>((props) => {
    const dispatch = useDispatch();
    const params = useParams<{ space_id: string }>();
    const [replyId, setReplyId] = useState<string>("");
    const thread = useThread(props.id);
    const replyMsg = useMessage(replyId ?? "");
    const postInput = usePostInput(thread ?? defaultThread);

    /**
     * Fetch thread if thread
     * not in store
     */
    useEffect(() => {
        if (thread == null) {
            const action = ThreadActionFactory.loadThread({
                space_id: params.space_id!,
                thread_id: props.id,
            });
            dispatch(action);
        }
    }, [thread?.id]);

    const handleSubmit = useCallback(
        (payload: any) => {
            if (replyId.length > 0 && replyMsg) {
                setReplyId("");
            }
            return postInput.onSubmit(
                payload,
                replyId.length > 0 ? replyId : undefined
            );
        },
        [thread?.id, replyMsg?.id]
    );

    if (thread == null) return <div className="flex flex-col flex-grow"></div>;

    return (
        <Menu.Reply.Provider value={setReplyId}>
            <div className="flex flex-col flex-grow overflow-hidden">
                <Conversation key={thread.id} thread={thread} />

                <div className="relative flex flex-col flex-none p-1 sm:p-4 overflow-hidden">
                    {replyMsg && (
                        <div className="relative w-full -top-1">
                            <ReplyPreview
                                message={replyMsg}
                                onClose={() => setReplyId("")}
                            />
                        </div>
                    )}
                    {!postInput.disabled && (
                        <Textarea.Post
                            {...postInput}
                            key={thread.id}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </Menu.Reply.Provider>
    );
});
