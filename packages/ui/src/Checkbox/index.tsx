import React, { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "regular" | "small";
}

export const variants = {
    regular:
        "py-3 px-4 bg-white font-semibold rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary-600 ",
    small: "py-1 px-2 bg-white font-semibold rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary-600 ",
    regulat:
        "form-tick appearance-none h-6 w-6 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none",
};

export type VariantType = "regular" | "small";

export default React.forwardRef<HTMLInputElement, IInputProps>(
    ({ variant = "regular", className = "", ...props }, ref) => {
        return (
            <input
                type="checkbox"
                value="1"
                className={variants[variant] + className}
                {...props}
                ref={ref}
            />
        );
    }
);
