import React from "react";

type PlacementType = {
    vertical?: string;
    horizontal?: string;
};

type OriginType = {
    anchor?: PlacementType;
    transform?: PlacementType;
};

interface IUserDropdownSelector {
    value?: string;
    options: string[];
    variant?: string;
    origin?: OriginType;
    onChange: (event: any, value: string) => void;
    anchor: HTMLElement;
}

export default React.forwardRef<HTMLElement, IUserDropdownSelector>(
    (props, ref) => {
        return <div ref={ref as any} />;
    }
);
