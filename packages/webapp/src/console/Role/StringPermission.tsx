import React, { useState } from "react";
import { Input } from "@colab/ui";
import { IStringPermission } from "@colab/store";
import { useDebouncedEffect } from "@colab/hooks";

interface IPermission {
    value: string;
    overwrite: boolean;
    permission: IStringPermission;
    onChange: (key: string, value: string) => void;
    onOverwrite: (key: string) => void;
}

export default function StringPermission(props: IPermission) {
    const [value, setValue] = useState<string>(props.value || "");

    useDebouncedEffect(
        () => {
            if (value !== props.value) {
                props.onChange(props.permission.permission, value);
            }
        },
        1000,
        [value, props.value]
    );

    function handleInput(e: any) {
        const value = e.target.value.trim();
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
                <Input value={value} className="my-2" onChange={handleInput} />
                <span className="mr-20 text-sm text-gray-700 text-gray-700">
                    {props.permission.description}
                </span>
            </div>
        </div>
    );
}
