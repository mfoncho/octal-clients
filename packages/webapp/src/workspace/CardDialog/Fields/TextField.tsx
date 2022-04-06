import React, { useState, useEffect } from "react";
import clx from "classnames";
import * as Icons from "@octal/icons";
import { Textarea, Markdown } from "@octal/ui";
import { useInput } from "src/utils";
import { useFieldAction } from "@workspace/Board/hooks";
import { CardTextValueRecord, CardFieldRecord } from "@octal/store";
import Field, { IField } from "./Field";

interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

function Edit({ disabled, value, onSubmit, onClose }: IEdit) {
    const description = useInput(value);

    function handleOnBlur() {
        if (description.valid || description.value == "") {
            onSubmit(description.value);
        }
        onClose();
    }

    return (
        <Textarea
            value={value}
            autoFocus={true}
            onBlur={handleOnBlur}
            onChange={description.setValue}
            className="break-word w-full text-gray-800 text-base"
        />
    );
}

export default function TextField({ field, handle }: IField) {
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
                        "break-word w-full text-gray-800 rounded-lg text-base",
                        {
                            ["h-8 bg-gray-100"]: !Boolean(text),
                        }
                    )}>
                    <Markdown image={false} table={true}>
                        {text}
                    </Markdown>
                </div>
            )}
        </Field>
    );
}
