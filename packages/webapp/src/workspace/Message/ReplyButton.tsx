import React from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@colab/store";
import { Text, Tooltip, Markdown } from "@colab/ui";
import emoji from "@colab/emoji";

interface IReplyChip {
    message: any;
}

export default React.memo((props: IReplyChip) => {
    const dispatch = useDispatch();

    const user = useUser(props.message.last_reply.author_id)!;

    const markdown = props.message.last_reply.markdown;

    function handleOpenReply() {
        dispatch({
            type: "OPEN_REPLY_THREAD",
            payload: props.message,
        });
    }

    function handleHighlightClicked(e: any, node: any) {
        if (node.type === "space") {
            dispatch({
                type: "OPEN_CHANNEL",
                payload: node.type_id,
            });
        }
    }

    return (
        <Tooltip
            placement="top"
            title={
                <span className="break-word">
                    {emoji.test(props.message.last_reply.text) ? (
                        <Text size={54}>{props.message.last_reply.text}</Text>
                    ) : (
                        <Markdown
                            image={false}
                            onHighlightClick={handleHighlightClicked}
                            code={markdown}
                            list={markdown}
                            table={markdown}
                            strike={markdown}
                            heading={markdown}
                            highlight={[]}
                            blockquote={markdown}>
                            {props.message.last_reply.text as string}
                        </Markdown>
                    )}
                </span>
            }>
            <button
                className="flex flex-row items-center bg-gray-300 px-2 py-1 rounded-xl"
                onClick={handleOpenReply}>
                <img
                    alt={user.name}
                    className="w-5 h-5 rounded-full"
                    src={user.avatar_url}
                />

                <span className="text-gray-600 font-semibold px-1">
                    {props.message.replies_count}
                </span>
            </button>
        </Tooltip>
    );
});
