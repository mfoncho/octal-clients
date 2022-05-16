import React from "react";
import Sections from "@workspace/Sections";
import CreateSpaceBtn from "./CreateSpaceBtn";
import { Scrollbars } from "react-custom-scrollbars";
import { SpaceRecord, useSpaces } from "@octal/store";
import Space from "./Space";

export default React.memo(() => {
    let spaces = useSpaces();

    function renderSpaces(space: SpaceRecord) {
        return <Space key={space.id} space={space} />;
    }

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
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
