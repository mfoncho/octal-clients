import React from "react";
import { createEditor, Descendant } from "slate";
import UIEvent from "../event";

export interface IAccept {
    max: number;
    types: string;
}

export interface State {
    value: string;
    data: Descendant[];
    files: File[];
    currentTarget?: HTMLDivElement;
}

export type EditorState = [State, React.Dispatch<React.SetStateAction<State>>];

export interface EventTarget {
    data: Descendant[];
    value: string;
    editor: ReturnType<typeof createEditor>;
    files: File[];
}

export interface InputProps<Data extends Descendant = Descendant> {
    files?: File[];
    data?: Data[];
    className?: string;
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onChange?: (event: UIEvent<EventTarget>) => void;
    onSubmit?: (event: UIEvent<EventTarget>) => void;
    autoFocus?: boolean;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    accept?: IAccept;
}
