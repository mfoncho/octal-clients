import React from "react";
import { Popper } from "@octal/ui";

interface IMenu {
    onSelect?: (e: React.MouseEvent) => void;
}

export default Popper.create<HTMLUListElement, IMenu>((props) => {
    return (
        <Popper
            as="ul"
            role="select"
            open={props.open}
            tabIndex={-1}
            distance={10}
            anchorEl={props.anchorEl}
            placement="bottom-start"
            onClickAway={props.onClickAway}
            className="z-10 focus:outline-none flex w-64 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 bg-white shadow-md overflow-x-hidden">
            <li
                data-menu-name="settings"
                className="flex group p-2 flex-row items-center hover:bg-primary-500 hover:text-white"
                onClick={props.onSelect}>
                <span className="px-4 font-semibold group-hover:text-white">
                    Settings
                </span>
            </li>
            <li
                data-menu-name="invite"
                className="flex group p-2 flex-row items-center hover:bg-primary-500"
                onClick={props.onSelect}>
                <span className="px-4 font-semibold group-hover:text-white">
                    Invite
                </span>
            </li>
        </Popper>
    );
});
