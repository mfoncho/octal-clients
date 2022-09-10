import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePermissions } from "../Space";
import { ActionT } from "./Menu";
import { MessageRecord, useEntityBookmark, Actions } from "@octal/store";
export function useActions(message: MessageRecord, authid: string = "") {
    const [loading, setLoading] = useState<string[]>([]);

    const dispatch = useDispatch();

    let authored = message.user_id === authid;

    const bookmark = useEntityBookmark(message.id);

    const permissions = usePermissions();

    const [buttons, setButtons] = useState<ActionT[]>([]);

    function addLoading(type: string) {
        setLoading((loading) => loading.concat([type]));
    }

    function removeLoading(type: string) {
        setLoading((loading) => loading.filter((load) => load !== type));
    }

    function removeLoadingCb(type: string) {
        return () => removeLoading(type);
    }

    useEffect(() => {
        let buttons: ActionT[] = ["react"];
        if (authored) {
            buttons.push("bookmark");
            buttons.push("reply");
        } else {
            buttons.push("reply");
            buttons.push("bookmark");
        }
        if (permissions.get("thread.manage")) buttons.push("pin");

        if (authored && permissions.get("message.edit")) {
            buttons.push("edit");
        }

        if (
            (authored && permissions.get("message.delete")) ||
            permissions.get("thread.manage")
        )
            buttons.push("delete");

        setButtons(buttons);
    }, [permissions]);

    const onReply = useCallback(() => {
        const action = Actions.Thread.setDraftReply({
            thread_id: message.thread_id,
            reply_id: message.id,
        });
        return dispatch(action);
    }, [message.id]);

    const onBookmark = useCallback(
        (notes: string = "") => {
            if (loading.includes("bookmark")) return;
            addLoading("bookmark");
            if (bookmark) {
                const action = Actions.Bookmark.deleteBookmark({
                    id: bookmark!.id,
                    entity_id: message.id,
                });
                return dispatch(action).finally(removeLoadingCb("bookmark"));
            } else {
                const action = Actions.Bookmark.createBookmark({
                    type: "message",
                    notes: notes,
                    entity_id: message.id,
                });
                return dispatch(action).finally(removeLoadingCb("bookmark"));
            }
        },
        [message.id, Boolean(bookmark), loading]
    );

    const onPin = useCallback(() => {
        if (loading.includes("pin")) return;
        addLoading("pin");
        const params = {
            message_id: message.id,
            thread_id: message.thread_id,
            space_id: message.space_id,
        };
        const action = message.pinned
            ? Actions.Thread.unpinMesssag(params)
            : Actions.Thread.pinMesssag(params);
        return dispatch(action).finally(removeLoadingCb("pin"));
    }, [message.id, message.pinned, loading]);

    const onReact = useCallback(
        (reaction: string) => {
            if (loading.includes("react")) return;
            addLoading("react");
            const params = {
                message_id: message.id,
                thread_id: message.thread_id,
                space_id: message.space_id,
                reaction: reaction,
            };
            const rtx = message.reactions.find(
                (rtx) => rtx.reaction == reaction
            );
            if (rtx && rtx.users.includes(authid)) {
                return dispatch(Actions.Thread.unreactMessage(params)).finally(
                    removeLoadingCb("react")
                );
            } else {
                return dispatch(Actions.Thread.reactMessage(params)).finally(
                    removeLoadingCb("react")
                );
            }
        },
        [message.id, message.reactions, loading]
    );

    const onDelete = useCallback(() => {
        if (loading.includes("delete")) return;
        addLoading("delete");
        const params = {
            space_id: message.space_id,
            message_id: message.id,
            thread_id: message.thread_id,
        };
        return dispatch(Actions.Thread.deleteMessage(params)).finally(
            removeLoadingCb("delete")
        );
    }, [message.id, loading]);

    const onUpdate = useCallback(
        (text: string) => {
            if (loading.includes("update")) return;
            addLoading("update");
            const params = {
                params: {
                    content: text.trim(),
                },
                thread_id: message!.thread_id,
                message_id: message!.id,
                space_id: message!.space_id,
            };

            return dispatch(Actions.Thread.updateMessage(params)).finally(
                removeLoadingCb("update")
            );
        },
        [message.id, loading]
    );

    return {
        onPin,
        onReply,
        onBookmark,
        buttons,
        onDelete,
        onUpdate,
        bookmark,
        onReact,
    };
}
