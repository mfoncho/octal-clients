import React, { useImperativeHandle, useRef } from "react";
import { useInput } from "src/utils";

export interface IColumnNameInput {
    defaultValue?: string;
    disabled?: boolean;
    onClose: (e: React.MouseEvent | any) => void;
    onSubmit?: (e: React.KeyboardEvent, name: string) => void;
}

export interface IColumnNameInputRef {
    reset: () => void;
    focus: () => void;
}

export default React.forwardRef<IColumnNameInputRef, IColumnNameInput>(
    ({ defaultValue = "", ...props }, ref) => {
        const name = useInput(defaultValue);

        const inputRef = useRef<HTMLInputElement | null>(null);

        function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key == "Enter" && props.onSubmit) {
                props.onSubmit(e, name.value);
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
            <input
                {...name.props}
                autoFocus={true}
                ref={inputRef}
                disabled={props.disabled}
                className="form-input font-semibold rounded-md border text-sm"
                onBlur={props.onClose}
                onKeyPress={handleKeyPress}
            />
        );
    }
);
