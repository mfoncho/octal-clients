import React from "react";

export interface ILayout {
    title?: string;
    children: any;
    className?: string;
}

export default React.forwardRef<HTMLDivElement, ILayout>((props, ref) => {
    return (
        <div
            ref={ref}
            className="flex flex-col flex-grow px-8 max-w-[720px] min-w-[500px]">
            <div className="flex flex-row h-20 items-center">
                <span className="text-lg font-bold text-gray-800">
                    {props.title}
                </span>
            </div>
            <div className={props.className}>{props.children}</div>
        </div>
    );
});
