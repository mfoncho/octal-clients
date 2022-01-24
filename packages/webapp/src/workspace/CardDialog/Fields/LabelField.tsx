import React, { useState, useRef } from "react";
import InfoIcon from "@material-ui/icons/Info";
import { useFieldAction } from "@workspace/Board/hooks";
import {
    CardLabelValueRecord,
    CardFieldRecord,
    LabelRecord,
} from "@octal/store";
import Field from "./Field";
import Label from "@workspace/Board/Label";
import { useLabels } from "@workspace/Board";
import LabelsPopper from "@workspace/Board/LabelsPopper";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface ILabelField {
    handle?: any;
    field: CardFieldRecord;
}

export interface IUserValue {
    value: CardLabelValueRecord;
}

export default function LabelField({ field, handle }: ILabelField) {
    const boardlabels = useLabels();

    const [editing, setEditing] = useState<boolean>(false);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const selected = field.values
        .map((value: any) => value.label_id)
        .toList()
        .toJS() as string[];

    const labels = boardlabels.filter((label) => selected.includes(label.id));

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function renderLabel(label: LabelRecord) {
        return (
            <div key={label.id} className="mr-1.5 mb-1.5">
                <Label name={label.name} color={label.color} />
            </div>
        );
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
            icon={InfoIcon}
            handle={handle}
            field={field}
            buttonRef={fieldRef}
            onClick={handleToggleEditMode}>
            <div className="flex flex-row flex-wrap items-center">
                {labels.map(renderLabel)}
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
