import React from "react";
import Header from "../Header";
import { Image } from "@colab/ui";
import { useUser } from "@colab/store";

export default React.memo(() => {
    const user = useUser();
    return (
        <Header className="flex flex-row px-8 items-center">
            <Image
                src={user.avatar}
                alt={user.username}
                className="h-12 w-12 rounded-xl"
            />
            <div className="px-3 flex flex-col items-center">
                <span className="font-bold text-base sm:font-black sm:text-lg text-gray-700 dark:text-white">
                    {user.username}
                </span>
                <span className="hidden sm:inline-flex font-semibold text-sm text-gray-500 dark:text-gray-200 relative -left-1.5">
                    {user.name}
                </span>
            </div>
        </Header>
    );
});
