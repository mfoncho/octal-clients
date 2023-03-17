import React from "react";
import cls from "classnames";
import { Link, useLocation } from "react-router-dom";

interface ISection {
    type?: "link" | "dialog";
    name: string;
    path?: string;
    icon: any;
}

export default React.memo<ISection>(function Section({
    icon: Icon,
    name,
    ...props
}) {
    const location = useLocation();
    if (props.path) {
        const inSection = location.pathname === props.path;
        return (
            <Link
                to={props.path}
                className={cls(
                    "flex flex-row justify-between mx-4 my items-center p-2 font-semibold rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                    
                    inSection ? "bg-primary-500 text-white":"text-black hover:bg-slate-200 dark:text-gray-200 dark:hover:text-gray-800"
                )}>
                <div className="flex flex-row items-center">
                    <div className="px-3">
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm">{name}</span>
                </div>
            </Link>
        );
    }
    return (
        <div className="flex flex-row justify-between mx-4 p-2 items-center rounded-md hover:bg-slate-300 font-semibold text-gray-700">
            <div className="flex flex-row items-center">
                <div className="px-3">
                    <Icon className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-sm">{name}</span>
            </div>
        </div>
    );
});
