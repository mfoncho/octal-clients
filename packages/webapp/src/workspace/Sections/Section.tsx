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
        return (
            <Link
                to={props.path}
                className={cls(
                    "flex flex-row justify-between my-0.5 items-center py-1 px-2 font-semibold",
                    {
                        ["text-gray-600 hover:bg-slate-200"]:
                            location.pathname !== props.path,
                        ["bg-primary-500 text-white"]:
                            location.pathname == props.path,
                    }
                )}>
                <div className="flex flex-row items-center">
                    <Icon className="w-6 h-6" />
                    <span className="pl-3 pr-1 text-sm">{name}</span>
                </div>
            </Link>
        );
    }
    return (
        <div className="flex flex-row justify-between my-0.5 items-center rounded-md py-1 px-2 hover:bg-primary-50 font-semibold text-gray-700">
            <div className="flex flex-row items-center">
                <Icon className="w-6 h-6 text-gray-500" />
                <span className="pl-3 pr-1 text-sm">{name}</span>
            </div>
        </div>
    );
});
