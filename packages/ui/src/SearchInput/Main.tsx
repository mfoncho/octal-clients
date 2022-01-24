import React, { useState } from "react";
import clx from "classnames";

export interface ISearchInput {
    value: string;
    loading?: boolean;
    classes?: any;
    className?: string;
    fullWidth?: boolean;
    elevation?: number;
    onFocus?: (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    placeholder?: string;
}

const SearchIcon = () => (
    <svg width="24" height="24" fill="none" className="text-gray-600">
        <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"></path>
    </svg>
);

export default React.memo<ISearchInput>((props) => {
    const [, setFocused] = useState(false);

    function handleInputFocused(e: any) {
        setFocused(true);
        return props.onFocus ? props.onFocus(e) : null;
    }

    function handleLostFocus() {
        setFocused(false);
    }

    return (
        <div className="relative flex-grow flex flex-row items-center">
            <div className="px-2">
                <SearchIcon />
            </div>
            <input
                onBlur={handleLostFocus}
                onFocus={handleInputFocused}
                className={clx(
                    "absolute focus:outline-none focus:border-transparent flex-1 pl-10 py-1 w-full bg-transparent rounded-md",
                    props.className
                )}
                value={props.value}
                onChange={props.onChange}
                autoFocus={props.autoFocus}
                onKeyPress={props.onKeyPress}
                placeholder={props.placeholder}
            />
        </div>
    );
});
