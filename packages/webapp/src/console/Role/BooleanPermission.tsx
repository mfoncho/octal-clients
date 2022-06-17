import React, { useState, useEffect } from "react";
import clx from "classnames";
import { Switch } from "@octal/ui";
import { IBooleanPermission } from "./permissions";

interface IPermission {
    value: boolean;
    overwrite: boolean;
    permission: IBooleanPermission;
    onChange: (key: string, value: boolean) => void;
    onOverwrite: (key: string) => void;
}

export default function BooleanPermission(props: IPermission) {
    const [value, setValue] = useState<boolean>(props.value);

    useEffect(() => {
        if (props.value !== value) {
            setValue(props.value);
        }
    }, [props.value]);

    function handleToggle() {
        setValue(!value);
        props.onChange(props.permission.permission, !value);
    }

    function handleToggleDefault(e: React.ChangeEvent<HTMLInputElement>) {
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
            <div className="flex px-2 flex-row flex-1 items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                        {props.permission.name}
                    </span>
                    <span
                        className={clx(
                            "mr-20 text-sm text-gray-700",
                            props.overwrite ? "text-gray-700" : "text-gray-500"
                        )}>
                        {props.permission.description}
                    </span>
                </div>
                <Switch checked={value} onChange={handleToggle} />
            </div>
        </div>
    );
}
