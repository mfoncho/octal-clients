import React, { useState } from "react";
import clx from "classnames";
import { Text, Textarea } from "@octal/ui";
import * as Icons from "@octal/icons";
import { CardFieldRecord } from "@octal/store";
import { useInput } from "src/utils";
import { useCardCapability } from "../hooks";
import { useFieldAction } from "@workspace/Board/hooks";
import { IoMdTrash as DeleteIcon } from "react-icons/io";

export interface IField {
    handle?: any;
    field: CardFieldRecord;
    index?: number;
    dragging?: boolean;
}

interface ICardField {
    dragging?: boolean;
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
        if (!name.valid && onClose) {
            onClose(e);
        }
    }

    function handleSubmit() {
        if (name.valid) {
            actions.updateField({ name: name.value });
        }
        if (onClose) {
            onClose({});
        }
    }

    return (
        <Textarea.Input
            autoFocus={true}
            onBlur={handleOnBlur}
            className="rounded px-1 py-0.5 min-w-[128px] focus:outline-none font-bold text-gray-700 text-sm w-full bg-slate-100"
            onSubmit={handleSubmit}
            {...name.props}
        />
    );
}

export default React.forwardRef<HTMLDivElement, ICardField>(
    ({ field, icon, ...props }, rootRef) => {
        const Icon = icon;

        const actions = useFieldAction(field);

        const can = useCardCapability(field.card_id);

        const [rename, setRename] = useState(false);

        return (
            <div
                ref={rootRef}
                className={clx(
                    "flex flex-col rounded-md px-1 py-2",
                    props.dragging && "bg-primary-50"
                )}>
                <div
                    {...can("card.manage", props.handle)}
                    className="group flex flex-row justify-between items-center">
                    <div className="flex-1 flex flex-col">
                        {rename ? (
                            <Rename
                                field={field}
                                onClose={() => setRename(false)}
                            />
                        ) : (
                            <span className="text-gray-700 px-1 font-bold text-sm">
                                <Text>{field.name}</Text>
                            </span>
                        )}
                    </div>
                    {can(
                        "card.manage",
                        <div
                            className={clx(
                                "flex flex-row items-center space-x-2 group-hover:visible invisible",
                                { hidden: rename }
                            )}>
                            {Boolean(icon) && (
                                <button
                                    onClick={props.onClick}
                                    className="p-1.5 rounded-md hover:bg-gray-100"
                                    ref={props.buttonRef}>
                                    <Icon className="text-gray-500" />
                                </button>
                            )}
                            <button
                                onClick={() => setRename(true)}
                                className="p-1 rounded-md  hover:bg-gray-100">
                                <Icons.Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                                onClick={() => actions.deleteField()}
                                className="p-1 rounded-md  hover:bg-gray-100">
                                <DeleteIcon className="text-gray-500 h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-row">{props.children}</div>
            </div>
        );
    }
);
