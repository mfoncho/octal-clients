import React, { useState, useRef } from "react";
import { useFieldAction } from "@workspace/Catalog/hooks";
import {
    RecordLabelValueRecord,
    RecordFieldRecord,
    LabelRecord,
} from "@colab/store";
import Field, { IField } from "./Field";
import * as Icons from "@colab/icons";
import Label from "@workspace/Catalog/Label";
import { useRecordCapability } from "../hooks";
import { useLabels } from "@workspace/Catalog";
import LabelsPopper from "@workspace/Catalog/LabelsPopper";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface ILabelField extends IField {
    handle?: any;
    field: RecordFieldRecord;
}

export interface IUserValue {
    value: RecordLabelValueRecord;
}

export default function LabelField({ field, handle, ...props }: ILabelField) {
    const cataloglabels = useLabels();

    const [editing, setEditing] = useState<boolean>(false);

    const [loading, setLoading] = useState<string[]>([]);

    const can = useRecordCapability(field.record_id);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const selected = field.values
        .map((value: any) => (value as RecordLabelValueRecord).label_id)
        .toList()
        .toJS() as string[];

    const labels = cataloglabels.toMap().mapKeys((_index, val) => val.id);

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
                        onClose={can("record.manage") ? onClose : undefined}
                    />
                </div>
            );
        }
        return null;
    }

    function handleLabelInput(label: LabelRecord) {
        if (loading.includes(label.id)) return;

        let cleanUpLoading = () =>
            setLoading((loading) => loading.filter((lid) => lid !== label.id));

        setLoading((loading) => loading.concat([label.id]));

        if (selected.includes(label.id)) {
            const value = field.values.find(
                (value: any) => value.label_id == label.id
            );
            if (value) {
                return actions
                    .deleteFieldValue(value.id)
                    .finally(cleanUpLoading);
            }
        } else {
            return actions
                .createFieldValue({ value: label.id })
                .finally(cleanUpLoading);
        }
    }

    return (
        <Field handle={handle} dragging={props.dragging} field={field}>
            <div className="flex flex-row flex-wrap items-center space-x-1 space-y-1 first-child:mt-1 first-child:ml-1">
                {can(
                    "record.manage",
                    <button
                        ref={fieldRef}
                        className="group py-1 px-2 hover:bg-slate-200 rounded-xl border-2 border-gray-300 border-dashed bg-primary-50"
                        onClick={handleToggleEditMode}>
                        <Icons.Field.Label className="text-gray-600" />
                    </button>
                )}
                {selected.map(renderLabel)}
            </div>
            {can(
                "record.manage",
                <LabelsPopper
                    open={editing}
                    selected={selected}
                    onSelect={handleLabelInput}
                    anchorEl={fieldRef.current}
                    onClickAway={handleToggleEditMode}
                />
            )}
        </Field>
    );
}
