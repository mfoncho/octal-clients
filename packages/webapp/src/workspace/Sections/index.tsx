import React from "react";
import Section from "./Section";
import { FiClipboard as Assigned } from "react-icons/fi";
import { HiOutlineFolder as FolderIcon } from "react-icons/hi";
import { BiCalendar as CalendarIcon } from "react-icons/bi";

const sections = [
    {
        name: "Assigned",
        path: "/",
        icon: Assigned,
    },
    {
        name: "My Calendar",
        path: "/calendar",
        icon: CalendarIcon,
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
