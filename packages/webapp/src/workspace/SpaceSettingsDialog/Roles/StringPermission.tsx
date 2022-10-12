import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Input } from "@colab/ui";
import { IStringPermission } from "@colab/store";

interface IPermission {
    value: string;
    enabled: boolean;
    permission: IStringPermission;
    onChange: (key: string, value: string) => void;
    onClear: (key: string) => void;
}

export default function StringPermission(props: IPermission) {
    const [value, setValue] = useState<string>(props.value || "");

    useEffect(() => {
        if (props.value !== value) {
            setValue(props.value);
        }
    }, [props.value]);

    function handleInput(e: any) {
        const value = e.target.value.trim();
        setValue(value);
        props.onChange(props.permission.permission, value);
    }

    function handleToggleDefault(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            props.onChange(props.permission.permission, "");
        } else {
            props.onClear(props.permission.permission);
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
                <Input
                    value={value ?? ""}
                    className="my-2"
                    onChange={handleInput}
                    disabled={!props.enabled}
                />
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
