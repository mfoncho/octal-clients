import React from "react";
import * as Icons from "@colab/icons";
import { Markdown } from "@colab/ui";
import { useUser } from "@colab/store";

import ReplyIcon from "@material-ui/icons/Reply";
import UserRecord from "@workspace/UserCard";
import { MessageRecord } from "@colab/store/lib/records";

export interface IMessage {
    message: MessageRecord;
    onClose?: (e: React.MouseEvent) => void;
}

export default React.memo<IMessage>(({ message, onClose }) => {
    const author = useUser(message.user_id)!;

    const [record, handleOpenRecord] = UserRecord.useRecord(author?.id);

    let content = message.parsed;

    if (content.length > 1) {
        content = [content[0]];
    }

    return (
        <div className="flex flex-row relative group bg-gray-100 dark:bg-slate-600 rounded-t-md pr-2">
            <div className="flex flex-none justify-center flex-row w-16">
                <ReplyIcon className="w-full h-full text-primary-500" />
            </div>
            <div className="flex flex-grow flex-col">
                <div className="flex flex-row items-center justify-between">
                    <button
                        onClick={handleOpenRecord}
                        className="text-base font-bold dark:text-gray-100">
                        {author.username}
                    </button>
                    <button onClick={onClose}>
                        <Icons.CloseCircleSolid className="text-gray-600 dark:text-gray-200" />
                    </button>
                </div>

                <span className="line-clamp-2 text-msg dark:text-gray-100 max-h-[52px] text-ellipsis overflow-hidden">
                    <Markdown>{content}</Markdown>
                </span>
            </div>
            {record}
        </div>
    );
});
