import React from "react";
import { Button } from "@octal/ui";
import { HiMenuAlt4 as MenuIcon } from "react-icons/hi";
import { useNavigatorDrawer } from "src/hooks";

export default React.forwardRef<
    HTMLDivElement,
    React.HTMLProps<HTMLDivElement>
>((props, ref) => {
    const [, navigator] = useNavigatorDrawer();
    return (
        <header
            ref={ref}
            className="flex flex-none border-b border-gray-200 flex-row items-center h-14 sm:h-20 flex-start sm:justify-between">
            <div className="flex flex-row items-center sm:hidden pl-1 sm:pl-8 pr-2">
                <Button
                    variant="icon"
                    color="clear"
                    onClick={() => navigator.toggle({})}
                    className="visible sm:hidden">
                    <MenuIcon />
                </Button>
            </div>
            <div {...props}>{props.children}</div>
        </header>
    );
});
