import React, { useState, useEffect, useRef } from "react";
import InfoIcon from "@material-ui/icons/Info";
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
    value: CardUserValueRecord;
}

function UserValue({ value }: IUserValue) {
    const user = useUser(value.user_id);
    return (
        <div className="flex flex-row p-2 rounded-lg bg-gray-100 items-center">
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

    return (
        <Field
            icon={InfoIcon}
            handle={handle}
            field={field}
            buttonRef={fieldRef}
            onClick={handleToggleEditMode}>
            <div className="flex flex-row flex-wrap items-center">
                {field.values.map((value: any) => (
                    <div key={value.id} className="mr-1.5 mb-1">
                        <UserValue value={value} />
                    </div>
                ))}
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
