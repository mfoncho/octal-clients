import React from "react";
import UserRecord from "@workspace/UserCard";
import { Markdown } from "@colab/ui";
import { useUser, useMessage } from "@colab/store";

export interface IMessage {
    id: string;
}

export default React.memo<IMessage>(({ id }) => {
    const message = useMessage(id);
    const author = useUser(message?.user_id)!;
    const [record, handleOpenRecord] = UserRecord.useRecord(message?.user_id);

    if (message) {
        let content = message.parsed;

        if (content.length > 1) {
            content = [content[0]];
        }

        return (
            <div className="flex flex-row relative rounded-t-md pr-2">
                <div className="flex flex-row items-end justify-end pl-8 w-16 h-[20px]">
                    <div className="border-l-2 border-gray-500 rounded-tl-md border-t-2 w-[34px] h-[10px]" />
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <div
                        role="button"
                        onClick={handleOpenRecord}
                        className="w-max flex flex-row items-center justify-between">
                        <img
                            alt={author.name}
                            src={author.avatar}
                            className="rounded-full w-[20px] h-[20px]"
                        />
                        <button className="text-base font-bold text-primary-500 px-2">
                            {author.username}
                        </button>
                    </div>
                    <span className="w-fit line-clamp-1 text-msg dark:text-gray-100 max-h-[52px] text-ellipsis">
                        <Markdown>{content}</Markdown>
                    </span>
                </div>
                {record}
            </div>
        );
    }
    return (
        <div className="flex flex-row relative rounded-t-md pr-2">
            <div className="flex flex-row items-end pl-8 w-16 h-[20px]">
                <div className="border-l-2 border-gray-500 rounded-tl border-t-2 w-[25px] h-[10px]" />
            </div>
            <div className="flex flex-row items-center justify-between space-x-2 mr-4">
                <div className="rounded-full bg-slate-400 w-[20px] h-[20px]" />
            </div>
        </div>
    );
});
