import React, { useState } from "react";
import * as Icons from "@colab/icons";
import { Text } from "@colab/ui";

interface ILabel {
    name: string;
    color: string;
    onClose?: () => void;
}

export default function Label(props: ILabel) {
    const [disabled, setDisabled] = useState(false);
    function handleClose(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (props.onClose) {
            props.onClose();
        }
        // Disable close button so it only fires once
        setDisabled(true);
    }
    return (
        <div
            className="group hover:relative flex flex-row px-1 items-center rounded-xl max-h-7 h-7"
            style={{ backgroundColor: `${props.color}30` }}>
            <span className="px-1 font-semibold text-sm py-1 text-gray-800">
                <Text>{props.name}</Text>
            </span>
            {props.onClose && (
                <button
                    disabled={disabled}
                    onClick={handleClose}
                    className="absolute -top-1 -right-1.5 group-hover:visible invisible">
                    <Icons.CloseCircleSolid />
                </button>
            )}
        </div>
    );
}
