import React from "react";
import Hidden from "@material-ui/core/Hidden";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

const screens: Breakpoint[] = ["xl", "lg", "md", "sm", "xs"];

const HiddenComponent: any = Hidden as any

export interface IView {
    size: string;
    children?: any;
}

function View({ size, children }: IView) {
    const sizes = size.split("|");

    const only: Breakpoint | Breakpoint[] = screens.filter(
        (size) => !sizes.includes(size)
    );

    return <HiddenComponent only={only}>{children}</HiddenComponent>;
}

export default React.memo(View);
