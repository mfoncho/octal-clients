import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { MessageRecord } from "@octal/store";
import {
    flagMesssag,
    unflagMesssag,
    pinMesssag,
    updateMessage,
    unpinMesssag,
    reactMessage,
    deleteMessage,
    unreactMessage,
} from "@octal/store/lib/actions/thread";

export function useActions(message: MessageRecord, authid: string = "") {
    const dispatch = useDispatch();

    const onFlag = useCallback(() => {
        const params = {
            message_id: message.id,
            thread_id: message.thread_id,
            space_id: message.space_id,
        };
        const action = message.flagged
            ? unflagMesssag(params)
            : flagMesssag(params);
        return dispatch(action);
    }, [message.id, message.flagged]);

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

    return { onPin, onFlag, onDelete, onUpdate, onReact };
}
