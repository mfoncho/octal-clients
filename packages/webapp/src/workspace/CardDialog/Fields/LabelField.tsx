import React, { useState, useRef } from "react";
import { useFieldAction } from "@workspace/Board/hooks";
import {
    CardLabelValueRecord,
    CardFieldRecord,
    LabelRecord,
} from "@octal/store";
import Field, { IField } from "./Field";
import * as Icons from "@octal/icons";
import Label from "@workspace/Board/Label";
import { useLabels } from "@workspace/Board";
import LabelsPopper from "@workspace/Board/LabelsPopper";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface ILabelField extends IField {
    handle?: any;
    field: CardFieldRecord;
}

export interface IUserValue {
    value: CardLabelValueRecord;
}

export default function LabelField({ field, handle, ...props }: ILabelField) {
    const boardlabels = useLabels();

    const [editing, setEditing] = useState<boolean>(false);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const selected = field.values
        .map((value: any) => (value as CardLabelValueRecord).label_id)
        .toList()
        .toJS() as string[];

    const labels = boardlabels.toMap().mapKeys((_index, val) => val.id);

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function renderLabel(id: string) {
        const label = labels.get(id);
        if (label) {
            const onClose = () => handleLabelInput(label);
            return (
                <div key={label.id} className="mr-1.5 mb-1.5">
                    <Label
                        name={label.name}
                        color={label.color}
                        onClose={onClose}
                    />
                </div>
            );
        }
        return null;
    }

    function handleLabelInput(label: LabelRecord) {
        if (selected.includes(label.id)) {
            const value = field.values.find(
                (value: any) => value.label_id == label.id
            );
            if (value) {
                return actions.deleteFieldValue(value.id);
            }
        } else {
            return actions.createFieldValue({ value: label.id });
        }
    }

    return (
        <Field
            icon={Icons.Field.Label}
            handle={handle}
            dragging={props.dragging}
            field={field}
            buttonRef={fieldRef}
            onClick={handleToggleEditMode}>
            <div className="flex flex-row flex-wrap items-center">
                {selected.map(renderLabel)}
            </div>
            <LabelsPopper
                open={editing}
                selected={selected}
                onSelect={handleLabelInput}
                anchorEl={fieldRef.current}
                onClickAway={handleToggleEditMode}
            />
        </Field>
    );
}
