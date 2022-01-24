import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Textarea, Markdown } from "@octal/ui";
import InfoIcon from "@material-ui/icons/Info";
import { useInput } from "src/utils";
import { useFieldAction } from "@workspace/Board/hooks";
import { CardTextValueRecord, CardNumberValueRecord } from "@octal/store";
import Field, { IField } from "./Field";

interface IEdit {
    value?: number | string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: number) => void;
}

function Edit({ disabled, value, onSubmit, onClose }: IEdit) {
    const number = useInput<number>(value as any);

    function handleOnBlur() {
        if (number.valid) {
            onSubmit(Number(number.value));
        }
        onClose();
    }

    return (
        <input
            disabled={disabled}
            autoFocus={true}
            onBlur={handleOnBlur}
            {...number.props}
            type="number"
            className="focus:outline-none break-word w-full text-gray-800 text-base"
        />
    );
}

export default function NumberField({ field, handle }: IField) {
    const [editing, setEditing] = useState<boolean>(false);

    const actions = useFieldAction(field);

    const value = field.values.first()! as any as CardNumberValueRecord;

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function handleCloseEditMode() {
        setEditing(false);
    }

    function handleUpdateValue(number: number) {
        if (value) {
            return actions.updateFieldValue(value.id, { value: number });
        } else {
            return actions.createFieldValue({ value: number });
        }
    }

    const number = value ? value.value : "";

    return (
        <Field
            handle={handle}
            icon={InfoIcon}
            onClick={handleToggleEditMode}
            field={field}>
            {editing ? (
                <Edit
                    value={number}
                    onClose={handleCloseEditMode}
                    onSubmit={handleUpdateValue}
                />
            ) : (
                <div
                    onClick={handleToggleEditMode}
                    className={clx(
                        "break-word w-full text-gray-800 rounded-lg text-base",
                        {
                            ["h-6 bg-gray-100"]: number === "",
                        }
                    )}>
                    {number}
                </div>
            )}
        </Field>
    );
}
