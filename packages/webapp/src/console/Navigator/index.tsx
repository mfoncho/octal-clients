import React from "react";
import clx from "classnames";
import { Link, useLocation } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Text } from "@colab/ui";
import routes from "@console/routes";
import { startsWith } from "lodash";

export interface IManager {
    path: string;
    name: string;
    type: string;
    icon: React.FC<any> | React.ComponentClass<any>;
}

export interface ISection {
    name: string;
    managers: IManager[];
}

const managers: IManager[] = routes.filter(
    (route) => !route.path.includes(":")
);

const sections: ISection[] = managers.reduce((sections, manager) => {
    const index = sections.findIndex(
        (section) => section.name === manager.type.toUpperCase()
    );

    if (index === -1) {
        sections.push({
            name: manager.type.toUpperCase(),
            managers: [manager],
        });
    } else {
        const section = sections[index]!;
        section.managers.push(manager);
    }
    return sections;
}, [] as ISection[]);

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
                "flex flex-row px-2 py-1.5 items-center hover:bg-primary-600 mx-4 rounded-lg",
                {
                    ["text-white bg-primary-500"]: selected,
                    ["hover:text-white dark:text-primary-200 text-gray-700"]:
                        !selected,
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
            <div className="flex flex-col py-4 px-5 border-t border-slate-400">
                <span className="font-black text-gray-800 dark:text-primary-100 text-lg">
                    Console
                </span>
            </div>
            <Scrollbars autoHide className="flex flex-col">
                <div className="flex flex-col w-full space-y-12 bp-8">
                    {sections.map((section) => (
                        <div key={section.name} className="flex flex-col">
                            <div className="flex flex-col py-2 px-5">
                                <span className="text-xs font-bold text-gray-800 dark:text-primary-100">
                                    {section.name}
                                </span>
                            </div>
                            {section.managers.map(renderManager)}
                        </div>
                    ))}
                </div>
            </Scrollbars>
        </div>
    );
});
