import React from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core/styles";

const colors = {
    red: "text-red-700 bg-red-100",
    gray: "text-gray-700 bg-gray-100",
    green: "text-green-700 bg-green-100",
    orange: "text-orange-700 bg-orange-100",
}

type ColorType = keyof typeof colors;

export interface IStatus {
    color: ColorType;
    children: React.ReactNode | string;
}

export default React.memo<IStatus>((props) => {
    return (
        <span
            className={cls(
                "rounded-full text-xs font-semibold px-2 py-1",
                colors[props.color]
            )}>
            {props.children}
        </span>
    );
});
