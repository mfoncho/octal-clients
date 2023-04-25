import React from "react";
import { Map } from "immutable";
import Sections from "@workspace/Sections";
import { Scrollbars } from "react-custom-scrollbars";
import { SpaceRecord, useSpaces } from "@colab/store";
import Space from "./Space";

type SpacesType = ReturnType<typeof useSpaces>;

const defaultSpaces: SpacesType = Map();

const sortSpaces = (a: SpaceRecord, b: SpaceRecord) => {
    if (a.created_at > b.created_at) return 1;
    if (a.created_at < b.created_at) return -1;
    return 0;
};

export default React.memo(() => {
    let spaces = useSpaces();

    function renderSpaces(space: SpaceRecord) {
        return <Space key={space.id} space={space} />;
    }

    const grouped = spaces.groupBy((space) =>
        space.is_direct ? space.type : "general"
    );

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            <Sections />
            <Scrollbars autoHide>
                <div className="flex flex-col min-h-full">
                    <div className="flex flex-col overflow-hidden space-y-1">
                        {grouped
                            .get("general", defaultSpaces)
                            .toList()
                            .sort(sortSpaces)
                            .map(renderSpaces)}
                    </div>
                    <div className="flex flex-col pt-8 pb-14 overflow-hidden space-y-1">
                        {grouped
                            .get("direct", defaultSpaces)
                            .toList()
                            .sort(sortSpaces)
                            .map(renderSpaces)}
                    </div>
                </div>
            </Scrollbars>
        </div>
    );
});
