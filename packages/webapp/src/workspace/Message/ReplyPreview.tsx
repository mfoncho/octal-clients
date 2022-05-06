import React from "react";
import clx from "classnames";
import * as Icons from "@octal/icons";
import { Markdown } from "@octal/ui";
import { useUser } from "@octal/store";
import ReplyIcon from "@material-ui/icons/Reply";
import { MessageRecord } from "@octal/store/lib/records";

export interface IMessage {
    message: MessageRecord;
    onClose?: (e: React.MouseEvent) => void;
}

export default React.memo<IMessage>(({ message, onClose }) => {
    const author = useUser(message.user_id)!;

    let content = message.parsed;

    if (content.length > 1) {
        content = [content[0]];
    }
    //console.log(content);

    return (
        <div className="flex flex-row relative group bg-gray-100 rounded-t-md pr-2">
            <div className="flex flex-none justify-center flex-row w-16">
                <ReplyIcon className="w-full h-full text-primary-500" />
            </div>
            <div className="flex flex-grow flex-col">
                <div className="flex flex-row items-center justify-between">
                    <button className="text-base font-bold">
                        {author.username}
                    </button>
                    <button onClick={onClose}>
                        <Icons.CloseCircleSolid className="text-gray-600" />
                    </button>
                </div>

                <span className="line-clamp-2 text-msg max-h-[52px] text-ellipsis overflow-hidden">
                    <Markdown>{content}</Markdown>
                </span>
            </div>
        </div>
    );
});
