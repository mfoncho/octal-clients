import React from "react";
import { Map } from "immutable";
import Sections from "@workspace/Sections";
import CreateSpaceBtn from "./CreateSpaceBtn";
import { Scrollbars } from "react-custom-scrollbars";
import { SpaceRecord, useSpaces } from "@octal/store";
import Space from "./Space";

type SpacesType = ReturnType<typeof useSpaces>;

const defaultSpaces: SpacesType = Map();

export default React.memo(() => {
    let spaces = useSpaces();

    function renderSpaces(space: SpaceRecord) {
        return <Space key={space.id} space={space} />;
    }

    const grouped = spaces.groupBy((space) =>
        space.access == "direct" ? space.access : "general"
    );

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            <div className="py-2">
                <CreateSpaceBtn />
            </div>
            <Sections />
            <Scrollbars autoHide className="flex flex-col">
                <div className="flex flex-col overflow-hidden">
                    {grouped
                        .get("direct", defaultSpaces)
                        .toList()
                        .map(renderSpaces)}
                </div>
                <div className="flex flex-col pb-14 overflow-hidden">
                    {grouped
                        .get("general", defaultSpaces)
                        .toList()
                        .map(renderSpaces)}
                </div>
            </Scrollbars>
        </div>
    );
});
