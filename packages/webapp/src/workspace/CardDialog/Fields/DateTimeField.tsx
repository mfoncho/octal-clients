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

    const fieldRef = useRef<HTMLDivElement>(null);

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
                    time={true}
                    value={value ? value.value : new Date().toISOString()}
                />
            </Popover>
        );
    }

    const btnProps = can("card.manage", {
        role: "button",
        onClick: can("card.manage", handleOpenDatePicker),
    });

    return (
        <Field field={field} handle={handle} dragging={props.dragging}>
            {value ? (
                <div
                    {...btnProps}
                    ref={fieldRef}
                    role="button"
                    className="font-bold text-gray-700 py-1 px-2 bg-slate-100 rounded-md hover:bg-slate-200 text-sm">
                    {moment(value.value).format("MMMM Do YYYY, h:mm")}
                </div>
            ) : (
                <div
                    {...btnProps}
                    ref={fieldRef}
                    role="button"
                    className="font-semibold h-6 w-36 text-gray-700 p-1 rounded-md bg-slate-200 hover:bg-slate-400"
                />
            )}
            {popper && can("card.manage") ? renderPopover() : null}
        </Field>
    );
}
