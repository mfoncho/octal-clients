import React from "react";
import Text from "../Text";

interface ILabel {
    icon?: string;
    name: string;
    color: string;
}

export default function Label(props: ILabel) {
    return (
        <div
            className="flex flex-row px-1 items-center rounded-xl max-h-7 h-7"
            style={{ backgroundColor: `${props.color}30` }}>
            <span className="px-1 font-semibold text-sm py-1 text-gray-800">
                <Text>{props.name}</Text>
            </span>
        </div>
    );
}

