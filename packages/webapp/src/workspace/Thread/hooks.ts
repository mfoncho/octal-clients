import { useEffect, useCallback, useState } from "react";
import { useThrottledEffect, useDebouncedEffect } from "@octal/hooks";
import { useDispatch } from "react-redux";
import { ThreadRecord } from "@octal/store";
import { UIEvent } from "@octal/ui";
import * as ThreadActions from "@octal/store/lib/actions/thread";
import { usePermissions } from "@workspace/Space";

interface FileInput {
    value: string;
    files: File[];
}

export function usePostInput(thread: ThreadRecord) {
    const dispatch = useDispatch();

    const permissions = usePermissions();

    const [accept, setAccept] = useState<{ max: number; types: string }>();

    useEffect(() => {
        setAccept({
            max: permissions.upload_limit.value,
            types: permissions.upload_types.value,
        });
    }, [permissions]);

    const onChange = useCallback(
        (event: UIEvent<FileInput>) => {
            const action = ThreadActions.updateDaft({
                thread_id: thread.id,
                space_id: thread.space_id,
                params: {
                    value: event.target.value,
                    files: event.target.files,
                },
            });
            dispatch(action);
        },
        [thread.id, thread.draft]
    );

    useThrottledEffect(
        () => {
            const action = ThreadActions.threadActivity({
                type: "typing",
                thread_id: thread.id,
                space_id: thread.space_id,
            });
            return dispatch(action);
        },
        5000,
        [thread.id, thread.draft.value]
    );

    const onSubmit = useCallback(
        (payload: UIEvent<FileInput>, reply_id?: string) => {
            const { target } = payload;
            if (target.value.length > 0 || target.files.length > 0) {
                const [file, ...files] = target.files;
                const postAction = ThreadActions.postMessage({
                    content: target.value,
                    reply_id: reply_id!,
                    space_id: thread.space_id,
                    thread_id: thread.id,
                    //@ts-ignore
                    attachment: file,
                });
                const resetAction = ThreadActions.updateDaft({
                    thread_id: thread.id,
                    space_id: thread.space_id,
                    params: {
                        value: "",
                        files: files,
                    },
                });
                dispatch(resetAction);
                return dispatch(postAction);
            }
        },
        [thread.id]
    );

    return {
        value: thread.draft.value,
        files: thread.draft.files,
        onChange,
        onSubmit,
        accept,
        disabled: !permissions.post_message.value,
    };
}
