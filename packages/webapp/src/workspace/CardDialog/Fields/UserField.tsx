import React, { useState, useRef } from "react";
import * as Icons from "@octal/icons";
import MembersPopper from "@workspace/Space/MembersPopper";
import { useFieldAction } from "@workspace/Board/hooks";
import {
    CardUserValueRecord,
    CardFieldRecord,
    useUser,
    MemberRecord,
} from "@octal/store";
import Field from "./Field";

export interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

export interface IUserField {
    handle?: any;
    field: CardFieldRecord;
}

export interface IUserValue {
    onClose?: () => void;
    value: CardUserValueRecord;
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
        <div className="group hover:relative flex flex-row p-2 rounded-lg bg-gray-100 items-center">
            <img
                alt={user.username}
                className="h-6 w-6 rounded-full"
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

export default function UserField({ field, handle }: IUserField) {
    const [editing, setEditing] = useState<boolean>(false);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const selected = field.values
        .map((value: any) => value.user_id)
        .toList()
        .toJS() as string[];

    function handleToggleEditMode() {
        setEditing((editing) => !editing);
    }

    function handleUserInput(member: MemberRecord) {
        if (selected.includes(member.user_id)) {
            const value = field.values.find(
                (value: any) => value.user_id == member.user_id
            );
            if (value) {
                return actions.deleteFieldValue(value.id);
            }
        } else {
            return actions.createFieldValue({ value: member.user_id });
        }
    }

    function renderUser(value: CardUserValueRecord) {
        const onClose = () => actions.deleteFieldValue(value.id);
        return (
            <div key={value.id} className="mr-1.5 mb-1">
                <UserValue onClose={onClose} value={value} />
            </div>
        );
    }

    return (
        <Field
            icon={Icons.Field.Users}
            handle={handle}
            field={field}
            buttonRef={fieldRef}
            onClick={handleToggleEditMode}>
            <div className="flex flex-row flex-wrap items-center">
                {field.values.map(renderUser as any)}
            </div>
            <MembersPopper
                selected={selected as any}
                onSelect={handleUserInput}
                anchorEl={fieldRef.current}
                onClickAway={handleToggleEditMode}
                open={editing}
            />
        </Field>
    );
}
