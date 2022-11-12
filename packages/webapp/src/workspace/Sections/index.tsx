import React from "react";
import Section from "./Section";
import * as Icons from "@colab/icons";
import { usePermissions } from "@colab/store";
import CreateSpaceBtn from "./CreateSpaceBtn";

const sections = [
    {
        name: "Assigned",
        path: "/",
        icon: Icons.Clipboard,
    },
    {
        name: "Calendar",
        path: "/calendar",
        icon: Icons.Calendar,
    },
];

export default React.memo(function Sections() {
    const permissions = usePermissions();
    return (
        <div className="flex flex-col py-4">
            {sections.map((section) => (
                <Section key={section.name} {...section} />
            ))}
            {permissions.get("space.create") && (
                <div className="">
                    <CreateSpaceBtn />
                </div>
            )}
        </div>
    );
});
