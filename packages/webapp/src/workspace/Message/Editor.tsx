import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Textarea } from "@octal/ui";
import { Dialog } from "@octal/ui";
import { useMessage, MessageRecord } from "@octal/store";
import { useInput } from "src/utils";
import { updateMessage } from "@octal/store/lib/actions/thread";

export interface IEditor {
    id: string;
    onClose: () => void;
}

const Editor = React.memo<{ message: MessageRecord; onClose: () => void }>(
    ({ message, onClose }) => {
        const dispatch = useDispatch();
        const content = useInput(message.content ?? "");
        const [loading, setLoading] = useState<boolean>(false);

        function handleSavePost(e: any) {
            let value = e.target.value.trim();
            if (
                loading == false &&
                value.length > 1 &&
                value !== message.content
            ) {
                const params = {
                    params: {
                        content: value,
                    },
                    thread_id: message!.thread_id,
                    message_id: message!.id,
                    space_id: message!.space_id,
                };

                setLoading(true);
                return dispatch(updateMessage(params))
                    .then(onClose)
                    .catch(() => {
                        setLoading(false);
                    });
            }
        }
        return (
            <Textarea.Post
                {...content.props}
                autoFocus={true}
                disabled={loading}
                onSubmit={handleSavePost}
            />
        );
    }
);

export default React.memo<IEditor>((props: any) => {
    const message = useMessage(props.id)!;

    return (
        <Dialog.Base
            open={Boolean(message)}
            fullWidth
            maxWidth="sm"
            onClose={props.onClose}>
            <Editor message={message} onClose={props.onClose} />
        </Dialog.Base>
    );
});
