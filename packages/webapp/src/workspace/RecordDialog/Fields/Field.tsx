import React, { useState } from "react";
import clx from "classnames";
import { Text, Dialog, Textarea } from "@colab/ui";
import * as Icons from "@colab/icons";
import Warning from "./DeleteWarning";
import { RecordFieldRecord } from "@colab/store";
import { useInput } from "src/utils";
import { useRecordCapability } from "../hooks";
import { useFieldAction } from "@workspace/Catalog/hooks";
import { IoMdTrash as DeleteIcon } from "react-icons/io";

export interface IField {
    handle?: any;
    field: RecordFieldRecord;
    index?: number;
    dragging?: boolean;
}

interface IRecordField {
    dragging?: boolean;
    handle?: any;
    icon?: any; //React.FunctionComponent<IIcon> | React.ComponentClass<IIcon>;
    onClick?: (event: any) => void;
    children?: any;
    buttonRef?: React.RefObject<HTMLButtonElement>;
    contentRef?: (el: HTMLDivElement) => void | React.RefObject<HTMLDivElement>;
    field: RecordFieldRecord;
}

interface IRname {
    field: RecordFieldRecord;
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

export default React.forwardRef<HTMLDivElement, IRecordField>(
    ({ field, icon, ...props }, rootRef) => {
        const Icon = icon;

        const dialog = Dialog.useDialog();

        const actions = useFieldAction(field);

        const can = useRecordCapability(field.record_id);

        return (
            <div
                ref={rootRef}
                className={clx(
                    "flex flex-col rounded-md px-1 py-2",
                    props.dragging && "bg-primary-50"
                )}>
                <div
                    {...can("record.manage", props.handle)}
                    className="group flex flex-row justify-between items-center">
                    <div className="flex-1 flex flex-col">
                        {dialog.rename ? (
                            <Rename field={field} onClose={dialog.close} />
                        ) : (
                            <span className="text-gray-700 px-1 font-bold text-sm">
                                <Text>{field.name}</Text>
                            </span>
                        )}
                    </div>
                    {can(
                        "record.manage",
                        <div
                            className={clx(
                                "flex flex-row items-center space-x-2 group-hover:visible invisible",
                                { hidden: dialog.rename }
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
                                onClick={dialog.opener("rename")}
                                className="p-1 rounded-md  hover:bg-gray-100">
                                <Icons.Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                                onClick={dialog.opener("warning")}
                                className="p-1 rounded-md  hover:bg-gray-100">
                                <DeleteIcon className="text-gray-500 h-4 w-4" />
                            </button>
                            <Warning
                                field={field}
                                open={dialog.warning}
                                onConfirm={() => actions.deleteField()}
                                onClose={dialog.close}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-row">{props.children}</div>
            </div>
        );
    }
);
