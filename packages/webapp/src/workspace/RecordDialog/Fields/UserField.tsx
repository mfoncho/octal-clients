import React, { useState, useRef } from "react";
import * as Icons from "@colab/icons";
import { Image } from "@colab/ui";
import MembersPopper from "@workspace/Space/MembersPopper";
import { useFieldAction } from "@workspace/Catalog/hooks";
import {
    RecordUserValueRecord,
    RecordFieldRecord,
    useUser,
    MemberRecord,
} from "@colab/store";
import { useRecordCapability } from "../hooks";
import Field, { IField } from "./Field";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface IUserField extends IField {
    handle?: any;
    field: RecordFieldRecord;
}

export interface IUserValue {
    onClose?: () => void;
    value: RecordUserValueRecord;
}

function UserValue({ value, onClose }: IUserValue) {
    const user = useUser(value.user_id);
    const [disabled, setDisabled] = useState(false);
    function handleClose(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (onClose) {
            onClose();
        }
        // Disable close button so it only fires once
        setDisabled(true);
    }
    return (
        <div className="group hover:relative flex flex-row p-px rounded-md bg-slate-100 items-center">
            <Image
                alt={user.username}
                className="h-8 w-8 rounded-l-md"
                src={user.avatar}
            />
            <div className="px-2">
                <span className="text-gray-800 font-semibold text-sm">
                    {user.name}
                </span>
            </div>
            {onClose && (
                <button
                    disabled={disabled}
                    onClick={handleClose}
                    className="absolute -top-1 -right-1.5 group-hover:visible invisible">
                    <Icons.CloseCircleSolid />
                </button>
            )}
        </div>
    );
}

export default function UserField({ field, handle, ...props }: IUserField) {
    const [editing, setEditing] = useState<boolean>(false);

    const [loading, setLoading] = useState<string[]>([]);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const can = useRecordCapability(field.record_id);

    const selected = field.values
        .map((value: any) => value.user_id)
        .toList()
        .toJS() as string[];

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function handleUserInput(member: MemberRecord) {
        if (loading.includes(member.user_id)) return;
        let cleanUpLoading = () =>
            setLoading((loading) =>
                loading.filter((lid) => lid !== member.user_id)
            );
        setLoading((loading) => loading.concat([member.user_id]));
        if (selected.includes(member.user_id)) {
            const value = field.values.find(
                (value: any) => value.user_id == member.user_id
            );
            if (value) {
                return actions
                    .deleteFieldValue(value.id)
                    .finally(cleanUpLoading);
            }
        } else {
            return actions
                .createFieldValue({ value: member.user_id })
                .finally(cleanUpLoading);
        }
    }

    function renderUser(value: RecordUserValueRecord) {
        const onClose = () => actions.deleteFieldValue(value.id);
        return (
            <div key={value.id}>
                <UserValue
                    onClose={can("record.manage") ? onClose : undefined}
                    value={value}
                />
            </div>
        );
    }

    return (
        <Field dragging={props.dragging} handle={handle} field={field}>
            <div className="flex flex-row flex-wrap items-center space-x-1 space-y-1 first-child:mt-1 first-child:ml-1">
                {can(
                    "record.manage",
                    <button
                        ref={fieldRef}
                        className="group p-1 hover:bg-slate-200 rounded-xl border-2 border-gray-300 border-dashed bg-primary-50"
                        onClick={handleToggleEditMode}>
                        <Icons.AddUser className="w-6 h-6 text-gray-600" />
                    </button>
                )}
                {field.values.map(renderUser as any)}
            </div>
            {can(
                "record.manage",
                <MembersPopper
                    selected={selected as any}
                    onSelect={handleUserInput}
                    anchorEl={fieldRef.current}
                    onClickAway={handleToggleEditMode}
                    open={editing}
                />
            )}
        </Field>
    );
}
