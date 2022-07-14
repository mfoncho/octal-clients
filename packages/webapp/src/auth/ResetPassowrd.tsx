import React from "react";
import Header from "./Header";
import ResetForm from "./components/ResetForm";

export default React.memo(() => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex-1 flex flex-row justify-center">
                <div className="container flex flex-col items-center justify-start sm: pt-20 px-8 sm:pt-8 sm:px-16">
                    <ResetForm />
                </div>
            </div>
            <Header />
        </div>
    );
});
