import React from "react";
import { Popper } from "@colab/ui";

interface IMenu {
    onSelect: (e: React.MouseEvent) => void;
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
            className="focus:outline-none flex w-64 flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 bg-white shadow-md overflow-x-hidden">
            <li
                data-menu-name="edit"
                className="flex group p-2 flex-row items-center hover:bg-primary-500 hover:text-white"
                onClick={props.onSelect}>
                <span className="px-4 font-semibold group-hover:text-white">
                    Edit
                </span>
            </li>
            <li
                data-menu-name="stash"
                className="flex group p-2 flex-row items-center hover:bg-primary-500"
                onClick={props.onSelect}>
                <span className="px-4 font-semibold group-hover:text-white">
                    Stash
                </span>
            </li>
        </Popper>
    );
});
