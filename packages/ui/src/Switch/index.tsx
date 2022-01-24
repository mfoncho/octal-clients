import React from "react";

export default React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
    const checkedClasses =
        props.checked || props.defaultChecked ? "bg-green-400" : "bg-gray-300";
    return (
        <label
            className={
                "toggle-label w-10 relative block overflow-hidden h-6 rounded-full cursor-pointer " +
                checkedClasses
            }>
            <input
                ref={ref}
                type="checkbox"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                {...props}
            />
        </label>
    );
});
