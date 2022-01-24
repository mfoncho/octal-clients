import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Textarea } from "@octal/ui";
import { Dialog } from "@octal/ui";
import { updateMessage } from "@octal/store/lib/actions/thread";

export default React.memo((props: any) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState<boolean>(false);

    function handleSavePost({ text }: { text: string }) {
        let value = text.trim();
        if (value.length > 0) {
            const params = {
                content: text.trim(),
                thread_id: props.message.thread_id,
                message_id: props.message.id,
                space_id: props.message.space_id,
            };

            dispatch(updateMessage(params))
                .then(props.onClose)
                .catch(() => {
                    setLoading(false);
                });
            setLoading(true);
        }
    }

    return (
        <Dialog.Base
            open
            fullWidth
            maxWidth="sm"
            onClose={loading ? undefined : props.onClose}>
            <Textarea.Post
                autoFocus
                rows={3}
                disabled={loading}
                value={props.message.content}
                multiline={props.message.markdown}
                onSubmit={handleSavePost}
            />
        </Dialog.Base>
    );
});
