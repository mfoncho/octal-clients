import React from "react";
import clx from "classnames";
import { Switch } from "@octal/ui";
import { IBooleanPermission } from "./permissions";

interface IPermission {
    value: boolean;
    enabled: boolean;
    permission: IBooleanPermission;
    onChange: (key: string, value: boolean) => void;
    onClear: (key: string) => void;
}

export default function BooleanPermission(props: IPermission) {
    function handleToggle() {
        props.onChange(props.permission.permission, !props.value);
    }

    function handleToggleDefault(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            props.onChange(props.permission.permission, false);
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
            <div className="flex px-2 flex-row flex-1 items-center justify-between">
                <div className="flex flex-col">
                    <span
                        className={clx(
                            "text-sm font-semibold",
                            props.enabled ? "text-gray-800" : "text-gray-500"
                        )}>
                        {props.permission.name}
                    </span>
                    <span
                        className={clx(
                            "mr-20 text-sm text-gray-700",
                            props.enabled ? "text-gray-700" : "text-gray-500"
                        )}>
                        {props.permission.description}
                    </span>
                </div>
                <Switch checked={props.value ?? ""} onChange={handleToggle} />
            </div>
        </div>
    );
}
