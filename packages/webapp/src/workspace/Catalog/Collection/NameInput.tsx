import React, { useImperativeHandle, useRef } from "react";
import { Textarea } from "@colab/ui";
import { useInput } from "src/utils";

export interface ICollectionNameInput {
    defaultValue?: string;
    disabled?: boolean;
    onClose: (e: React.MouseEvent | any) => void;
    onSubmit?: (name: string) => void;
}

export interface ICollectionNameInputRef {
    reset: () => void;
    focus: () => void;
}

export default React.forwardRef<ICollectionNameInputRef, ICollectionNameInput>(
    ({ defaultValue = "", ...props }, ref) => {
        const name = useInput(defaultValue);

        const inputRef = useRef<HTMLInputElement | null>(null);

        function handleSubmit() {
            if (name.valid && props.onSubmit) {
                props.onSubmit(name.value);
            }
        }

        useImperativeHandle(
            ref,
            () => ({
                focus() {
                    inputRef.current?.scrollIntoView();
                    inputRef.current?.focus();
                },
                reset() {
                    name.setValue("");
                    this.focus();
                },
            }),
            []
        );

        return (
            <Textarea.Input
                autoFocus={true}
                onSubmit={handleSubmit}
                onBlur={props.onClose}
                placeholder="Record name"
                className="focus:border-primary-700 py-1.5 focus:shadow border-slate-500 border-2 px-2 w-full rounded-md mx-2 font-semibold text-base text-gray-900"
                {...name.props}
            />
        );
    }
);
