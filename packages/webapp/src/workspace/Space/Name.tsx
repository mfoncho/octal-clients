import React from "react";
import { Dialog } from "@colab/ui";
import InviteDialog from "../InviteDialog";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useSpace } from "./hooks";
import Menu from "./MenuPopper";

export default React.forwardRef<HTMLButtonElement>((props, ref) => {
    const space = useSpace();
    const dialog = Dialog.useDialog("");
    const nameRef = React.useRef<HTMLSpanElement>(null);
    const [dropdown, setDropdown] = React.useState<boolean>(false);

    function handleOpenDropdown(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setDropdown(true);
    }

    function handleCloseDropdown() {
        setDropdown(false);
    }

    function handleMenuSelect(e: React.MouseEvent) {
        let li = e.target as Node & Element;
        while (li.nodeName != "LI") {
            li = li.parentNode as Node & Element;
        }
        const name = li.getAttribute("data-menu-name");
        dialog.open(name);
        console.log(name);
    }

    return (
        <>
            <button
                onClick={handleOpenDropdown}
                ref={ref}
                className="flex flex-row items-center">
                <span ref={nameRef} className="font-bold" {...props}>
                    {space.name}
                </span>
                <span className="px-2">
                    <ArrowDropDownIcon />
                </span>
            </button>
            <Menu
                open={dropdown}
                anchorEl={nameRef.current}
                onClickAway={handleCloseDropdown}
                onSelect={handleMenuSelect}
            />
            <InviteDialog
                onClose={dialog.close}
                open={dialog.invite}
                space={space}
            />
        </>
    );
});
