import React, { useState } from "react";
import { CardFieldRecord } from "@octal/store";
import { useInput } from "src/utils";
import { useFieldAction } from "@workspace/Board/hooks";
import { IoMdTrash as DeleteIcon } from "react-icons/io";

export interface IField {
    handle?: any;
    field: CardFieldRecord;
    index?: number;
    draging?: boolean;
}

interface ICardField {
    handle?: any;
    icon?: any; //React.FunctionComponent<IIcon> | React.ComponentClass<IIcon>;
    onClick?: (event: any) => void;
    children?: any;
    buttonRef?: React.RefObject<HTMLButtonElement>;
    contentRef?: (el: HTMLDivElement) => void | React.RefObject<HTMLDivElement>;
    field: CardFieldRecord;
}

interface IRname {
    field: CardFieldRecord;
    onClose?: (e: any) => void;
}

function Rename({ field, onClose }: IRname) {
    const actions = useFieldAction(field);
    const name = useInput(field.name);

    function handleOnBlur(e: React.FocusEvent) {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(e);
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key == "Enter") {
            handleSubmit(e);
        }
    }

    function handleSubmit(event: React.FocusEvent | React.KeyboardEvent) {
        if (name.valid) {
            actions.updateField({ name: name.value });
        }
        if (onClose) {
            onClose(event);
        }
    }

    return (
        <input
            {...name.props}
            autoFocus={true}
            className="rounded px-2 focus:outline-none font-semibold text-gray-700"
            onKeyPress={handleKeyPress}
            onBlur={handleOnBlur}
        />
    );
}

export default React.forwardRef<HTMLDivElement, ICardField>(
    ({ field, icon, ...props }, rootRef) => {
        const Icon = icon;

        const actions = useFieldAction(field);

        const [rename, setRename] = useState(false);

        return (
            <div ref={rootRef} className="flex flex-col py-2">
                <div
                    {...props.handle}
                    className="group flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center">
                        {Boolean(icon) && (
                            <button
                                onClick={props.onClick}
                                ref={props.buttonRef}>
                                <Icon className="text-gray-500" />
                            </button>
                        )}
                        {rename ? (
                            <Rename
                                field={field}
                                onClose={() => setRename(false)}
                            />
                        ) : (
                            <button onClick={() => setRename(true)}>
                                <span className="text-gray-700 px-2 font-semibold">
                                    {field.name}
                                </span>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => actions.deleteField()}
                        className="flex flex-row group-hover:visible invisible">
                        <DeleteIcon className="text-gray-500 h-5 w-5" />
                    </button>
                </div>
                <div className="flex flex-row py-1 pl-8">{props.children}</div>
            </div>
        );
    }
);
