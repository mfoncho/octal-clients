import React, { useState } from "react";
import { Range } from "@octal/ui";
import NumberLabel from "./NumberLabel";
import { INumberPermission } from "@octal/store";
import { useDebouncedEffect } from "@octal/hooks";

interface IPermission {
    value: number;
    min: number;
    max: number;
    permission: INumberPermission;
    overwrite: boolean;
    onOverwrite: (key: string) => void;
    onChange: (key: string, value: number) => void;
}

export default function NumberPermission(props: IPermission) {
    const [value, setValue] = useState<number>(props.value);

    useDebouncedEffect(
        () => {
            if (value !== props.value) {
                props.onChange(props.permission.permission, value);
            }
        },
        700,
        [value, props.value]
    );

    function handleChange(_e: React.ChangeEvent<{}>, value: any) {
        setValue(value);
    }

    function handleToggleDefault(_e: React.ChangeEvent<HTMLInputElement>) {
        props.onOverwrite(props.permission.permission);
    }
    return (
        <div className="flex flex-row p-4">
            <input
                onChange={handleToggleDefault}
                className="form-checkbox mt-0.5 rounded-full"
                checked={props.overwrite}
                type="checkbox"
            />
            <div className="flex px-2 flex-col flex-grow">
                <span className="text-sm font-semibold text-gray-800">
                    {props.permission.name}
                </span>
                <div className="pt-8">
                    <Range
                        min={props.min}
                        max={props.max}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="on"
                        ValueLabelComponent={NumberLabel}
                    />
                </div>
                <span className="mr-20 text-sm text-gray-700 text-gray-700">
                    {props.permission.description}
                </span>
            </div>
        </div>
    );
}
