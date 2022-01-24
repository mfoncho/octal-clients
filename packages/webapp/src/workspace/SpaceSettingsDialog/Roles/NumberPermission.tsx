import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Range } from "@octal/ui";
import NumberLabel from "./NumberLabel";
import { INumberPermission } from "./permissions";

interface IPermission {
    value: number;
    min: number;
    max: number;
    permission: INumberPermission;
    enabled: boolean;
    onClear: (key: string) => void;
    onChange: (key: string, value: number) => void;
}

export default function NumberPermission(props: IPermission) {
    const [value, setValue] = useState<number>(props.value || 0);

    useEffect(() => {
        if (props.value !== value) {
            setValue(props.value);
        }
    }, [props.value]);

    function handleChange(e: React.ChangeEvent<{}>, value: any) {
        props.onChange(props.permission.key, value);
    }

    function handleToggleDefault(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            props.onChange(props.permission.key, value);
        } else {
            props.onClear(props.permission.key);
        }
    }
    return (
        <div className="flex flex-row p-4">
            <input
                onChange={handleToggleDefault}
                className="form-checkbox mt-0.5 rounded-full"
                checked={props.enabled}
                type="checkbox"
            />
            <div className="flex px-2 flex-col flex-grow">
                <span
                    className={clx(
                        "text-sm font-semibold",
                        props.enabled ? "text-gray-800" : "text-gray-500"
                    )}>
                    {props.permission.name}
                </span>
                <div className="pt-8">
                    <Range
                        min={props.min}
                        max={props.max}
                        value={props.value}
                        disabled={!props.enabled}
                        onChange={handleChange}
                        valueLabelDisplay="on"
                        ValueLabelComponent={NumberLabel}
                    />
                </div>
                <span
                    className={clx(
                        "mr-20 text-sm text-gray-700",
                        props.enabled ? "text-gray-700" : "text-gray-500"
                    )}>
                    {props.permission.description}
                </span>
            </div>
        </div>
    );
}
