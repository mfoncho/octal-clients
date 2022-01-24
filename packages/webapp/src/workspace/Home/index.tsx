import React from "react";
import Header from "./Header";
import Status from "./Status";
import Assigned from "./Assigned";
export default React.memo(function Home() {
    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            <Header />
            <div className="flex-1 flex-col overflow-x-hidden overflow-y-auto p-8">
                <div className="flex flex-row items-center sm:justify-end pb-8">
                    <Status />
                </div>
                <div className="flex flex-col">
                    <Assigned />
                </div>
            </div>
        </div>
    );
});
