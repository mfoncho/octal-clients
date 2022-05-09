import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Textarea } from "@octal/ui";
import { Dialog } from "@octal/ui";
import { useMessage } from "@octal/store";
import { updateMessage } from "@octal/store/lib/actions/thread";

export interface IEditor {
    id: string;
    onClose: () => void;
}

export default React.memo<IEditor>((props: any) => {
    const dispatch = useDispatch();
    const message = useMessage(props.id);

    const [loading, setLoading] = useState<boolean>(false);

    function handleSavePost({ value }: { value: string }) {
        if (value.trim().length < 1) {
            const params = {
                content: value.trim(),
                thread_id: message!.thread_id,
                message_id: message!.id,
                space_id: message!.space_id,
            };

            setLoading(true);
            return dispatch(updateMessage(params))
                .then(props.onClose)
                .catch(() => {
                    setLoading(false);
                });
        }
    }

    return (
        <Dialog.Base
            open={Boolean(message)}
            fullWidth
            maxWidth="sm"
            onClose={loading ? undefined : props.onClose}>
            <Textarea.Post
                value={message!.content}
                rows={3}
                autoFocus={true}
                disabled={loading}
                onSubmit={handleSavePost}
            />
        </Dialog.Base>
    );
});