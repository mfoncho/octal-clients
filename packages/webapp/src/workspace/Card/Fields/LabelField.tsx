import React, { useState, useRef } from "react";
import {
    CardLabelValueRecord,
    CardFieldRecord,
    LabelRecord,
} from "@colab/store";
import Field, { IField } from "./Field";
import * as Icons from "@colab/icons";
import Label from "@workspace/Board/Label";
import { useCardCapability, useSpaceLabels, useFieldAction } from "../hooks";
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
    const spaceLabels = useSpaceLabels();

    const [editing, setEditing] = useState<boolean>(false);

    const [loading, setLoading] = useState<string[]>([]);

    const can = useCardCapability(field.card_id);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const selected = field.values
        .map((value: any) => (value as CardLabelValueRecord).label_id)
        .toList()
        .toJS() as string[];

    const labels = spaceLabels.toMap().mapKeys((_index, val) => val.id);

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
                        onClose={can("card.manage") ? onClose : undefined}
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
                    "card.manage",
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
                "card.manage",
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
