import React from "react";
import { Map } from "immutable";
import Sections from "@workspace/Sections";
import CreateSpaceBtn from "./CreateSpaceBtn";
import { Scrollbars } from "react-custom-scrollbars";
import { SpaceRecord, useSpaces, usePermissions } from "@octal/store";
import Space from "./Space";

type SpacesType = ReturnType<typeof useSpaces>;

const defaultSpaces: SpacesType = Map();

const sortSpaces = (a: SpaceRecord, b: SpaceRecord) => {
    if (a.created_at === b.created_at) return -1;
    if (a.created_at > b.created_at) return 0;
    else return 1;
};

export default React.memo(() => {
    let spaces = useSpaces();

    const permissions = usePermissions();

    function renderSpaces(space: SpaceRecord) {
        return <Space key={space.id} space={space} />;
    }

    const grouped = spaces.groupBy((space) =>
        space.access == "direct" ? space.access : "general"
    );

    return (
        <div className="flex flex-grow flex-col overflow-hidden">
            {permissions.get("space.create") && (
                <div className="py-2">
                    <CreateSpaceBtn />
                </div>
            )}
            <Sections />
            <Scrollbars autoHide className="flex flex-col">
                <div className="flex flex-col overflow-hidden space-y-1">
                    {grouped
                        .get("direct", defaultSpaces)
                        .toList()
                        .sort(sortSpaces)
                        .map(renderSpaces)}
                </div>
                <div className="flex flex-col pb-14 overflow-hidden">
                    {grouped
                        .get("general", defaultSpaces)
                        .toList()
                        .sort(sortSpaces)
                        .map(renderSpaces)}
                </div>
            </Scrollbars>
        </div>
    );
});
