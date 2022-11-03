import React from "react";
import Header from "../Header";
import { useUser } from "@colab/store";

export default React.memo(() => {
    const user = useUser();
    return (
        <Header className="flex flex-row px-8 items-center">
            <img
                src={user.avatar_url}
                alt={user.username}
                className="h-10 w-10 rounded-full"
            />
            <div className="px-3 flex flex-col items-center">
                <span className="font-bold text-base sm:font-black sm:text-lg text-gray-700">
                    {user.username}
                </span>
                <span className="hidden sm:inline-flex font-semibold text-sm text-gray-500 relative -left-1.5">
                    {user.name}
                </span>
            </div>
        </Header>
    );
});
