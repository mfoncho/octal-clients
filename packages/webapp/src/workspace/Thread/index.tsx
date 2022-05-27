import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useThread, useMessage } from "@octal/store";
import * as ThreadActionFactory from "@octal/store/lib/actions/thread";
import { Textarea } from "@octal/ui";
import Menu from "@workspace/Message/Menu";
import ReplyPreview from "./ReplyPreview";
import { usePostInput, usePermissions } from "../Space/hooks";
import Conversation from "../Conversation";

export interface IThread {
    id: string;
    menu?: string[];
}

export default React.memo<IThread>((props) => {
    const permissions = usePermissions();
    const dispatch = useDispatch();
    const params = useParams<{ space_id: string }>();
    const [menu, setMenu] = useState<string[]>(props.menu ?? []);
    const [replyId, setReplyId] = useState<string | null>(null);
    const thread = useThread(props.id);
    const replyMsg = useMessage(replyId ?? "");
    const postInput = usePostInput(thread);

    useEffect(() => {
        let actions = ["react", "reply", "flag"];
        if (permissions.pin_message) {
            actions.push("pin");
        }
        if (permissions.manage_space || permissions.delete_message) {
            actions.push("delete");
        }
        if (permissions.edit_message) {
            actions.push("edit");
        }
        setMenu(actions);
    }, [permissions]);

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
            if (replyId === null || (replyId?.length > 0 && replyMsg)) {
                setReplyId(null);
                return postInput.onSubmit(payload, replyId!);
            }
        },
        [thread?.id, replyMsg?.id]
    );

    if (thread == null) return <div className="flex flex-col flex-grow"></div>;

    return (
        <Menu.Reply.Provider value={setReplyId}>
            <Menu.Context.Provider value={menu}>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <Conversation thread={thread} />

                    <div className="relative flex flex-col flex-none p-1 sm:p-4 overflow-hidden">
                        {replyMsg && (
                            <div className="relative w-full -top-1">
                                <ReplyPreview
                                    message={replyMsg}
                                    onClose={() => setReplyId(null)}
                                />
                            </div>
                        )}
                        <Textarea.Post
                            {...postInput}
                            value=""
                            accept={undefined}
                            placeholder=""
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </Menu.Context.Provider>
        </Menu.Reply.Provider>
    );
});
