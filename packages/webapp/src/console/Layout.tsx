import React from "react";
import cls from "classnames";
import { useScreen } from "src/utils";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigatorDrawer } from "src/hooks";
import { useModule } from "@console/components/Module";

interface ILayout {
    icon?: React.ReactNode;
    title?: string | React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
}

export default React.memo<ILayout>((props) => {
    const [, drawer] = useNavigatorDrawer();
    const screen = useScreen();
    const module = useModule();
    const Icon = module.icon;
    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex flex-none border-b border-gray-200 dark:border-slate-600 flex-row items-center h-14 sm:h-20 flex-start sm:justify-between">
                {screen.mobile ? (
                    <button onClick={() => drawer.toggle({})} className="px-4">
                        <MenuIcon />
                    </button>
                ) : (
                    <button className="px-6">
                        {props.icon ? (
                            props.icon
                        ) : (
                            <div className="rounded-md text-gray-800">
                                <Icon />
                            </div>
                        )}
                    </button>
                )}
                <div className="flex flex-1 flex-row justify-between items-center py-2">
                    {props.header ? (
                        props.header
                    ) : props.title ? (
                        typeof props.title == "string" ? (
                            <span className="font-bold text-lg">
                                {props.title}
                            </span>
                        ) : (
                            props.title
                        )
                    ) : (
                        <span className="font-bold text-lg">{module.name}</span>
                    )}
                    {props.actions}
                </div>
            </div>
            <div className={cls("flex-grow overflow-y-auto", props.className)}>
                {props.children}
            </div>
        </div>
    );
});
