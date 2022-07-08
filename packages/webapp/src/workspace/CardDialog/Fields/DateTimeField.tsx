import React, { useState, useRef } from "react";
import * as Icons from "@octal/icons";
import { useFieldAction } from "@workspace/Board/hooks";
import { useCardCapability } from "../hooks";
import { CardDatetimeValueRecord } from "@octal/store";
import Field, { IField } from "./Field";
import Popover from "@material-ui/core/Popover";
import { Datepicker, UIEvent } from "@octal/ui";
import moment from "moment";

export default function DateTimeField({ field, handle, ...props }: IField) {
    const can = useCardCapability(field.card_id);
    const [popper, setPopper] = useState<boolean>(false);

    const fieldRef = useRef<HTMLButtonElement>(null);

    const actions = useFieldAction(field);

    const value = field.values.first()! as CardDatetimeValueRecord;

    function onChange(e: UIEvent) {
        setPopper(false);
        handleSetFieldValue(e.target.value);
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

    const btnProps = can("card.manage", {
        role: "button",
        onClick: can("card.manage", handleOpenDatePicker),
    });

    return (
        <Field
            icon={Icons.Field.DateTime}
            field={field}
            handle={handle}
            onClick={handleOpenDatePicker}
            dragging={props.dragging}
            buttonRef={fieldRef}>
            {value ? (
                <span
                    {...btnProps}
                    className="font-bold text-gray-700 py-1 px-2 bg-gray-50 rounded-md hover:bg-gray-100 text-sm">
                    {moment(value.value).format("MMMM Do YYYY, h:mm")}
                </span>
            ) : (
                <div
                    {...btnProps}
                    className="font-semibold h-6 w-36 text-gray-700 p-1 rounded-md bg-gray-50 hover:bg-gray-100"
                />
            )}
            {popper && can("card.manage") ? renderPopover() : null}
        </Field>
    );
}
