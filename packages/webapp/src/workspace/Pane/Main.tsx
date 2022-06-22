import React from "react";
import { Link } from "react-router-dom";
import { useWorkspace } from "@octal/store";
import paths from "src/paths";
import * as Icons from "@octal/icons";

const Site = React.memo(() => {
    const workspace = useWorkspace();

    const url = paths.workspace.spaces;

    const icon = workspace.get("icon", "")!;
    const name = workspace.get("name", "")!;

    return (
        <Link to={url}>
            <img src={icon} alt={name} className="w-10 h-10 rounded-lg" />
        </Link>
    );
});

export default React.memo(() => {
    return (
        <div className="flex flex-col w-16 items-center justify-between bg-primary-200 flex-none">
            <div className="flex flex-col py-4 items-center">
                <Site />
                <Link to={paths.console.dashboard} className="my-3 text-white">
                    <Icons.Console />
                </Link>
            </div>
        </div>
    );
});
