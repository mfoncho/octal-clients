import React from "react";
import { Text } from "@octal/ui";
import Username from "@workspace/Username";
import { useTopic } from "@octal/store";

interface IMentioned {
    id: string;
}

export function TopicMentioned({ id }: IMentioned) {
    const topic = useTopic(id);
    return (
        <span className="px-1 pb-0.5 my-0.5 bg-primary-100 rounded text-primary-800 font-semibold text-sm">
            #<Text>{topic.name}</Text>
        </span>
    );
}

export default function Mention({ attributes, children, element }: any) {
    let mentioned: any = null;
    switch (element.name) {
        case "user":
            mentioned = <Username id={element.entity} />;
            break;

        case "topic":
            mentioned = <TopicMentioned id={element.entity} />;
            break;

        default:
            mentioned = <span>#(:-|)</span>;
    }
    return (
        <span {...attributes} contentEditable={false}>
            {mentioned}
            {children && <span>{children}</span>}
        </span>
    );
}
