import React from "react";

export default React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGElement>>(
    (props, ref) => {
        const {
            className = "h-5 w-5",
            viewBox = "0 0 20 20",
            fill = "currentColor",
            ...rootProps
        } = props;
        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                viewBox={viewBox}
                fill={fill}
                {...rootProps}>
                <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }
);
