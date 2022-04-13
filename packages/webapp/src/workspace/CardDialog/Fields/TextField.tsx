import React, { useState } from "react";
import clx from "classnames";
import * as Icons from "@octal/icons";
import { Textarea, Markdown } from "@octal/ui";
import { useFieldAction } from "@workspace/Board/hooks";
import { CardTextValueRecord } from "@octal/store";
import Field, { IField } from "./Field";

interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

function Edit({ disabled, value, onSubmit, onClose }: IEdit) {
    const [desc, setDesc] = useState(value);

    function handleChange(des: string) {
        if (des !== value) {
            onSubmit(des);
        }
        onClose();
    }

    function handleBlur() {
        if (desc == value) {
            onClose();
        }
    }

    return (
        <div className="flex flex-col w-full">
            <Textarea
                value={value}
                disabled={disabled}
                onChange={setDesc}
                autoFocus={true}
                onBlur={handleBlur}
                onSubmit={handleChange}
                className="bg-primary-50 p-2 rounded-md break-word w-full text-gray-800 text-base"
            />
            <div className="flex flex-row justify-end pt-2 px-3">
                <button
                    onClick={onClose}
                    className="text-primary-500 font-bold text-xs">
                    cancel
                </button>
            </div>
        </div>
    );
}

export default function TextField({ field, handle, ...props }: IField) {
    const [editing, setEditing] = useState<boolean>(false);

    const actions = useFieldAction(field);

    const value = field.values.first()! as CardTextValueRecord;

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function handleCloseEditMode() {
        setEditing(false);
    }

    function handleUpdateText(text: string) {
        if (value) {
            return actions.updateFieldValue(value.id, { value: text });
        } else {
            return actions.createFieldValue({ value: text });
        }
    }

    const text = value ? value.value : "";

    return (
        <Field
            handle={handle}
            icon={Icons.Field.Text}
            dragging={props.dragging}
            onClick={handleToggleEditMode}
            field={field}>
            {editing ? (
                <Edit
                    value={text}
                    onClose={handleCloseEditMode}
                    onSubmit={handleUpdateText}
                />
            ) : (
                <div
                    onClick={handleToggleEditMode}
                    className={clx(
                        "flex flex-col break-word w-full text-gray-800 rounded-lg text-base",
                        {
                            ["h-8 bg-gray-100"]: !Boolean(text),
                        }
                    )}>
                    <div className="p-2 bg-gray-50 rounded-md">
                        <Markdown image={false} table={true}>
                            {text}
                        </Markdown>
                    </div>
                    <div className="flex flex-row justify-end pt-2 px-3">
                        <button className="text-primary-500 font-bold text-xs">
                            edit
                        </button>
                    </div>
                </div>
            )}
        </Field>
    );
}
