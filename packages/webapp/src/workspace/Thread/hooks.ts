import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { postMessage, threadActivity } from "@octal/store/lib/actions/thread";
import { usePermissions } from "@workspace/Space";

export function usePostInput(thread: { id: string; space_id: string }) {
    const dispatch = useDispatch();

    const [value] = useState<string>("");

    const permissions = usePermissions();

    const [accept, setAccept] = useState<{ max: number; types: string }>();

    useEffect(() => {
        setAccept({
            max: permissions.upload_limit.value,
            types: permissions.upload_types.value,
        });
    }, [permissions.upload_limit.value, permissions.upload_types.value]);

    const onChange = useCallback(() => {
        const action = threadActivity({
            type: "typing",
            thread_id: thread!.id,
            space_id: thread!.space_id,
        });
        return dispatch(action);
    }, [thread?.id]);

    const onSubmit = useCallback(
        (payload: any, reply_id?: string) => {
            const { target } = payload;
            if (target.value.length > 0 || target.files.length > 0) {
                const params = {
                    content: target.value,
                    reply_id: reply_id!,
                    space_id: thread.space_id,
                    thread_id: thread.id,
                    attachment: target.files[0],
                };
                return dispatch(postMessage(params));
            }
        },
        [thread?.id]
    );

    return {
        value,
        onChange,
        onSubmit,
        accept,
        disabled: !permissions.post_message.value,
    };
}
