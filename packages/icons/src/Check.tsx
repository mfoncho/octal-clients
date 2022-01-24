import React from "react";

export default React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGElement>>(
    (props, ref) => {
        const {
            className = "h-5 w-5",
            viewBox = "0 0 24 24",
            fill = "none",
            stroke = "currentColor",
            ...rootProps
        } = props;
        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                fill="none"
                viewBox={viewBox}
                stroke="currentColor"
                {...rootProps}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                />
            </svg>
        );
    }
);
