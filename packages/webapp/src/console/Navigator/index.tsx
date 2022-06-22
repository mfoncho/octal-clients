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
                "flex flex-row px-4 py-1 items-center hover:bg-primary-800",
                {
                    ["text-white bg-primary-500"]: selected,
                    ["text-primary-200"]: !selected,
                }
            )}>
            <div className="flex items-center justify-center w-6 h-6 mx-2 rounded-md">
                <Icon className="h-4 w-4" />
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
