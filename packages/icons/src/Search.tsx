import React from "react";

export default React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGElement>>(
    (props, ref) => {
        const {
            className = "h-5 w-5",
            viewBox = "0 0 20 20",
            fill = "none",
            ...rootProps
        } = props;
        return (
            <svg
                ref={ref}
                viewBox={viewBox}
                fill={fill}
                className={className}
                {...rootProps}>
                <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"></path>
            </svg>
        );
    }
);
