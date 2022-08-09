import React, { useState } from "react";
import clx from "classnames";
import { Textarea, Markdown } from "@octal/ui";
import { useFieldAction } from "@workspace/Board/hooks";
import { CardTextValueRecord } from "@octal/store";
import { useCardCapability } from "../hooks";
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
        if (desc.trim() == value.trim()) {
            onClose();
        }
    }

    return (
        <div className="flex flex-col w-full">
            <Textarea
                value={desc}
                disabled={disabled}
                autoFocus={true}
                onBlur={handleBlur}
                onChange={(e: any) => setDesc(e.target.value)}
                onSubmit={(e: any) => handleChange(e.target.value)}
                className="bg-slate-100 p-1 rounded-md break-word w-full text-gray-800 text-base"
            />
            <div className="flex flex-row justify-end pt-2 px-3">
                <button
                    onClick={onClose}
                    className="text-primary-500 font-black text-xs">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default function TextField({ field, handle, ...props }: IField) {
    const [editing, setEditing] = useState<boolean>(false);

    const can = useCardCapability(field.card_id);

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
        <Field handle={handle} dragging={props.dragging} field={field}>
            {editing ? (
                <Edit
                    value={text}
                    onClose={handleCloseEditMode}
                    onSubmit={handleUpdateText}
                />
            ) : (
                <div
                    className={clx(
                        "flex flex-col break-word w-full text-gray-800 rounded-lg text-base p-1",
                        {
                            ["h-10 bg-slate-100"]: !Boolean(text.trim()),
                        }
                    )}>
                    <div
                        className={clx({
                            ["bg-slate-100 p-2 rounded-md"]: !Boolean(
                                text.trim()
                            ),
                        })}>
                        <Markdown>{text}</Markdown>
                    </div>
                    {can(
                        "card.manage",
                        <div className="flex flex-row justify-end pt-2 px-3">
                            <button
                                onClick={handleToggleEditMode}
                                className="text-primary-500 font-black text-xs">
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Field>
    );
}
