import React from "react";
import Section from "./Section";
import * as Icons from "@colab/icons";

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
    return (
        <div className="flex flex-col py-4">
            {sections.map((section) => (
                <Section key={section.name} {...section} />
            ))}
        </div>
    );
});
