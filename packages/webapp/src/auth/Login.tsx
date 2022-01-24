import React from "react";
import Welcome from "./components/Welcome";
import LoginForm from "./components/LoginForm";
import OAuthProviders from "./components/OAuthProviders";
import Header from "./Header";

export default React.memo(() => {
    return (
        <div className="flex-1 flex flex-row overflow-hidden bg-white">
            <div className="flex-1 hidden sm:flex flex-col ">
                <Welcome />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden pt-16">
                <div className="flex-1 overflow-y-auto">
                    <div className="container flex flex-row justify-start sm:justify-center py-8 px-8 sm:py-8 sm:px-16">
                        <div className="flex flex-col justify-center flex-1 sm:max-w-[400px]">
                            <div className="flex flex-col items-center pb-4 pt-1">
                                <span className="text-xl font-black text-gray-800">
                                    Hi, Welcome Back
                                </span>
                            </div>
                            <OAuthProviders />
                            <div className="pb-4 pt-5 flex flex-row items-center justify-between">
                                <div className="w-full h-px rounded bg-gray-300" />
                                <span className="text-xs text-gray-400 font-bold px-4">
                                    OR
                                </span>
                                <div className="w-full h-px rounded bg-gray-300" />
                            </div>
                            <LoginForm />
                            <div className="flex flex-row justify-center py-4">
                                <span className="text-xs text-gray-400 font-light">
                                    ©2021 All Rights Reserved
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
});
