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
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
        );
    }
);
