import React from "react";

export interface IAsInput extends React.InputHTMLAttributes<HTMLInputElement> {
    as?: "input";
}

export interface IAsSpan
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    as?: "textarea";
}

export type IAsComboAttributes = IAsInput | IAsSpan;

export type IInput = {
    label: string;
    description?: string;
} & IAsComboAttributes;

export default function Input({
    label,
    as = "input",
    description,
    ...props
}: IInput) {
    const AsComponent: any = as;
    return (
        <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800 py-1">
                {label}
            </span>
            <AsComponent
                className="font-medium focus:outline-none focus:ring focus:border-blue-300  rounded-md border border-gray-100 bg-cool-gray-100 p-2 w-full text-base text-gray-800"
                {...props}
            />
            {description && (
                <span className="text-gray-500 py-1 text-sm font-medium">
                    {description}
                </span>
            )}
        </div>
    );
}
