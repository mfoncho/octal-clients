import React, { useState } from "react";
import Sections from "@workspace/Sections";
import CreateSpaceBtn from "./CreateSpaceBtn";
import { Scrollbars } from "react-custom-scrollbars";
import { SpaceRecord, useSpaces } from "@octal/store";
import Space from "./Space";

const search = (
    <div className="flex flex-col px-2 py-2 overflow-hidden">
        <input className="focus:outline-none focus:ring focus:border-blue-300  rounded-md border border-gray-200 py-1 px-2 w-full text-base text-gray-800" />
    </div>
);

export default React.memo(() => {
    let spaces = useSpaces();

    function renderSpaces(space: SpaceRecord) {
        return <Space key={space.id} space={space} />;
    }

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            {search}
            <Scrollbars autoHide className="flex flex-col">
                <div className="flex flex-col px-2 pb-14 overflow-hidden">
                    <div className="py-2">
                        <CreateSpaceBtn />
                    </div>
                    <Sections />
                    {spaces.toList().map(renderSpaces)}
                </div>
            </Scrollbars>
        </div>
    );
});
