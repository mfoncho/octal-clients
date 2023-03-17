import React from "react";
import { Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useNavigatorDrawer } from "src/hooks";

export default React.forwardRef<
    HTMLDivElement,
    React.HTMLProps<HTMLDivElement>
>((props, ref) => {
    const [, navigator] = useNavigatorDrawer();
    return (
        <header
            ref={ref}
            className="flex flex-none border-b border-gray-200 dark:border-slate-600 flex-row items-center h-14 sm:h-20 flex-start sm:justify-between">
            <div className="flex flex-row items-center sm:hidden pl-1 sm:pl-8 pr-2">
                <Button
                    color="clear"
                    variant="icon"
                    onClick={() => navigator.toggle({})}
                    className="visible sm:hidden">
                    <Icons.Menu className="dark:text-gray-100 dark:hover:text-white" />
                </Button>
            </div>
            <div {...props}>{props.children}</div>
        </header>
    );
});
