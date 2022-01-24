import React from "react";
import icons from "../logos";
import { useConfig } from "@octal/store";

type IProvider = keyof typeof icons;

export default React.memo(() => {
    const providers = useConfig().auth_providers.filter(
        ([, method]: any) => method == "oauth"
    );

    function renderProvider([type]: [string, string]) {
        const Icon = icons[type as IProvider];
        return (
            <a
                key={type}
                className="rounded-md border border-gray-200 bg-cool-gray-200 px-3.5 py-2.5 flex flex-row justify-center hover:shadow-md"
                href={`/auth/oauth/${type}`}>
                <Icon />
            </a>
        );
    }

    return (
        <div className="flex flex-row justify-center space-x-4">
            {providers.map(renderProvider)}
        </div>
    );
});
