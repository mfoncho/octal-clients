import React, { InputHTMLAttributes } from "react";
import LabeledInput from "./LabeledInput";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "regular" | "small";
}

export const variants = {
    regular:
        "py-2 px-4 bg-white font-semibold rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-600 ",
    small:
        "py-1 px-2 bg-white font-semibold rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-600 ",
};

export type VariantType = "regular" | "small";

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
    ({ variant = "regular", className = "", ...props }, ref) => {
        return (
            <input
                className={variants[variant] + className}
                {...props}
                ref={ref}
            />
        );
    }
);

(Input as any).Labeled = LabeledInput;

type TInput = typeof Input & { Labeled: typeof LabeledInput };

export default Input as TInput;
