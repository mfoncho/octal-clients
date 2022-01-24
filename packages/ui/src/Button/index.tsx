import React, { ButtonHTMLAttributes } from "react";
import clx from "classnames";

interface IButtonBase extends ButtonHTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    activeClass?: string;
    disabledClass?: string;
}

export const colors = {
    primary: {
        active: "bg-primary-500 text-white  hover:bg-primary-700 ",
        disabled: "bg-primary-300 text-white",
    },
    regular: {
        active: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        disabled: "bg-primary-100 text-gray-500",
    },
    danger: {
        active: "bg-red-500 text-white hover:bg-red-700 ",
        disabled: "bg-red-300",
    },
    clear: {
        active: "text-gray-700 hover:bg-gray-200",
        disabled: "text-gray-500",
    },
};

export const variants = {
    text: "py-2 px-4 font-semibold rounded-lg focus:outline-none ",
    icon:
        "w-8 h-8 rounded-md flex justify-center items-center focus:outline-none ",
};

interface IButton extends IButtonBase {
    color?: keyof typeof colors;
    variant?: keyof typeof variants;
}

export const Base = React.forwardRef<HTMLButtonElement, IButton>(
    (
        {
            disabled = false,
            activeClass = "",
            disabledClass = "",
            className = "",
            onClick = undefined,
            ...props
        },
        ref
    ) => {
        const classes = clx(className, disabled ? disabledClass : activeClass);
        if (disabled) {
            onClick = undefined;
        }
        return (
            <button className={classes} ref={ref} onClick={onClick} {...props}>
                {props.children}
            </button>
        );
    }
);

export const Button = React.forwardRef<HTMLButtonElement, IButton>(
    (
        { color = "regular", variant = "text", className = "", ...props },
        ref
    ) => {
        let colorClasses = colors[color];
        let variantClass = variants[variant];

        return (
            <Base
                className={clx(className, variantClass)}
                activeClass={colorClasses.active}
                disabledClass={colorClasses.disabled}
                ref={ref}
                {...props}>
                {props.children}
            </Base>
        );
    }
);

type Mains = typeof Button & { Base: typeof Base };

(Button as Mains).Base = Base;

export default Button as Mains;
