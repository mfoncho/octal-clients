import { useEffect, useCallback, useState } from "react";
import { useThrottledEffect } from "@octal/hooks";
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

    function setDraft(value: string, files: File[] = []) {
        const action = ThreadActions.updateDaft({
            thread_id: thread.id,
            space_id: thread.space_id,
            params: { value, files },
        });
        dispatch(action);
    }

    useEffect(() => {
        if (!permissions.get("message.post")) {
            setDraft("", []);
        }
        setAccept({
            max: permissions.get("upload.size") as number,
            types: permissions.get("upload.types") as string,
        });
    }, [permissions]);

    const onChange = useCallback(
        (event: UIEvent<FileInput>) => {
            setDraft(event.target.value, event.target.files);
        },
        [thread.id, thread.draft]
    );

    useThrottledEffect(
        () => {
            const action = ThreadActions.threadActivity({
                type: "typing",
                thread_id: thread.id,
                timestamp: new Date().toISOString(),
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
                    reply_id: reply_id!,
                    space_id: thread.space_id,
                    thread_id: thread.id,
                    params: {
                        attachment: file,
                        content: target.value.trim(),
                    },
                });
                setDraft("", files);
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
        disabled: !permissions.get("message.post"),
    };
}
