import React from "react";
import clx from "classnames";
import { Link, useLocation } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Text } from "@octal/ui";
import routes from "@console/routes";
import { startsWith } from "lodash";

export interface IManager {
    path: string;
    name: string;
    icon: React.FC<any> | React.ComponentClass<any>;
}

const managers: IManager[] = routes.filter(
    (route) => !route.path.includes(":")
);

function renderManager(manager: IManager) {
    return <Manager key={manager.name} {...manager} />;
}

const Manager = React.memo<IManager>((props) => {
    const location = useLocation();

    const selected = startsWith(location.pathname, props.path);

    const Icon = props.icon;

    return (
        <Link
            to={props.path}
            className={clx(
                "flex flex-row px-4 py-2 items-center hover:bg-primary-50",
                {
                    ["bg-primary-100 text-primary-700"]: selected,
                    ["text-gray-500"]: !selected,
                }
            )}>
            <div
                className={clx(
                    "flex items-center justify-center w-8 h-8 rounded-md",
                    {
                        ["bg-primary-500 text-white"]: selected,
                    }
                )}>
                <Icon className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm px-2">
                <Text>{props.name}</Text>
            </span>
        </Link>
    );
});

export default React.memo(() => {
    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            <Scrollbars autoHide className="flex flex-col pb-4 pt-12">
                {managers.map(renderManager)}
            </Scrollbars>
        </div>
    );
});
