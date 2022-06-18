import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { MessageRecord, useEntityBookmark } from "@octal/store";
import * as BookmarkActions from "@octal/store/lib/actions/bookmark";
import {
    pinMesssag,
    updateMessage,
    unpinMesssag,
    reactMessage,
    deleteMessage,
    unreactMessage,
} from "@octal/store/lib/actions/thread";

export function useActions(message: MessageRecord, authid: string = "") {
    const dispatch = useDispatch();

    const bookmark = useEntityBookmark(message.id);

    const onBookmark = useCallback(
        (notes: string = "") => {
            if (bookmark) {
                const action = BookmarkActions.deleteBookmark({
                    id: bookmark!.id,
                    entity: message.id,
                });
                return dispatch(action);
            } else {
                const action = BookmarkActions.createBookmark({
                    type: "message",
                    notes: notes,
                    entity: message.id,
                });
                return dispatch(action);
            }
        },
        [message.id, Boolean(bookmark)]
    );

    const onPin = useCallback(() => {
        const params = {
            message_id: message.id,
            thread_id: message.thread_id,
            space_id: message.space_id,
        };
        const action = message.pinned
            ? unpinMesssag(params)
            : pinMesssag(params);
        return dispatch(action);
    }, [message.id, message.pinned]);

    const onReact = useCallback(
        (reaction: string) => {
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
                return dispatch(unreactMessage(params));
            } else {
                return dispatch(reactMessage(params));
            }
        },
        [message.id, message.reactions]
    );

    const onDelete = useCallback(() => {
        const params = {
            space_id: message.space_id,
            message_id: message.id,
            thread_id: message.thread_id,
        };
        return dispatch(deleteMessage(params));
    }, [message.id]);

    const onUpdate = useCallback(
        (text: string) => {
            const params = {
                content: text.trim(),
                thread_id: message!.thread_id,
                message_id: message!.id,
                space_id: message!.space_id,
            };

            return dispatch(updateMessage(params));
        },
        [message.id]
    );

    return { onPin, onBookmark, onDelete, onUpdate, bookmark, onReact };
}
