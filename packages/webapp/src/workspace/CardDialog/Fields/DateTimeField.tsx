import React, { useState, useRef } from "react";
import * as Icons from "@octal/icons";
import { useFieldAction } from "@workspace/Board/hooks";
import { CardDatetimeValueRecord } from "@octal/store";
import Field, { IField } from "./Field";
import Popover from "@material-ui/core/Popover";
import { Datepicker } from "@octal/ui";
import moment, { Moment } from "moment";

export default function DateTimeField({ field, handle }: IField) {
    const [popper, setPopper] = useState<boolean>(false);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const value = field.values.first()! as CardDatetimeValueRecord;

    function onChange(e: React.MouseEvent, datetime: string) {
        e.stopPropagation();
        e.preventDefault();
        setPopper(false);
        handleSetFieldValue(datetime);
    }

    function onClear(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    }

    function handleOpenDatePicker(event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        setPopper(true);
    }

    function handleSetFieldValue(datetime: string) {
        if (value) {
            return actions.updateFieldValue(value.id, { value: datetime });
        } else {
            return actions.createFieldValue({ value: datetime });
        }
    }

    function handleCloseDatePicker() {
        setPopper(false);
    }

    function renderPopover() {
        return (
            <Popover
                open={true}
                anchorEl={fieldRef.current}
                onClose={handleCloseDatePicker}>
                <Datepicker
                    onClear={onClear}
                    onChange={onChange}
                    value={value ? value.value : ""}
                />
            </Popover>
        );
    }

    return (
        <Field
            handle={handle}
            icon={Icons.Field.DateTime}
            buttonRef={fieldRef}
            onClick={handleOpenDatePicker}
            field={field}>
            {value ? (
                <span
                    role="button"
                    className="cursor-pointer font-semibold text-gray-700 p-1 bg-gray-50 rounded-md hover:bg-gray-100"
                    onClick={handleOpenDatePicker}>
                    {moment(value.value).format("MMMM Do YYYY, h:mm")}
                </span>
            ) : (
                <div
                    role="button"
                    className="cursor-pointer font-semibold h-6 w-36 text-gray-700 p-1 rounded-md bg-gray-50 hover:bg-gray-100"
                    onClick={handleOpenDatePicker}></div>
            )}
            {popper ? renderPopover() : null}
        </Field>
    );
}
