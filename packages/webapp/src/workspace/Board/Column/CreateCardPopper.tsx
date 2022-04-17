import React, { useState, useRef } from "react";
import { Popper, Textarea } from "@octal/ui";
import * as Icons from "@octal/icons";
import { useNavigator } from "src/hooks";
import { ColumnRecord } from "@octal/store/lib/records";
import { useInput } from "src/utils";
import { useColumnActions } from "@workspace/Board/hooks";

interface ICreateCardPopper {
    column: ColumnRecord;
    onClose: (event: any, reason: string) => void;
}

interface IDropdownPopper {}

const flip = { flipVariations: false };

const TemplateDropdown = Popper.create<HTMLDivElement, IDropdownPopper>(
    (props) => {
        const [loading, setLoading] = useState<boolean>(false);

        function handleTemplateClick(event: React.MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
        }

        return (
            <Popper
                as="div"
                flip={flip}
                open={props.open}
                tabIndex={-1}
                portal={true}
                anchorEl={props.anchorEl}
                placement="bottom-end"
                data-popper="template-dropdown"
                style={{ width: props.anchorEl?.offsetWidth }}
                onClickAway={loading ? undefined : props.onClickAway}
                className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 bg-white shadow-md overflow-x-hidden">
                <div
                    onClick={handleTemplateClick}
                    className="flex flex-col py-2 px-4 items-center h-[256px]"></div>
            </Popper>
        );
    }
);

export default Popper.create<HTMLDivElement, ICreateCardPopper>(
    ({ column, ...props }) => {
        const actions = useColumnActions(column);

        const navigator = useNavigator();

        const dropdownRef = useRef<HTMLDivElement | null>(null);

        const [loading, setLoading] = useState<boolean>(false);

        const [dropdown, setDropdown] = useState<boolean>(false);

        const name = useInput("", (val) => val.length >= 2);

        function isDropdownBtn(e: MouseEvent) {
            let btn = e.composedPath().find((el) => el === e.target);
            return Boolean(btn);
        }

        function handleToggleDropdown(e: React.MouseEvent) {
            if (isDropdownBtn(e.nativeEvent) && e.type === "click") {
                setDropdown((value) => !value);
            }
        }

        function handleTemplateDropdownClickAway(
            e: MouseEvent | React.MouseEvent
        ) {
            /*
             *  Only close dropdown if click event
             *  was outside the root dropdown
             *  button element
             */
            if (dropdown) {
                let node = e.target as (Node & ParentNode) | null;
                while (node && node != dropdownRef.current) {
                    node = node.parentNode;
                }
                if (!Boolean(node)) {
                    setDropdown(false);
                }
            }
        }

        function handleClickAway(e: MouseEvent) {
            let suggestion = e.composedPath().find((el: any) => {
                if (el.getAttribute) {
                    return (
                        el.getAttribute("data-popper") === "template-dropdown"
                    );
                }
                return false;
            });
            if (!Boolean(suggestion) && loading === false && props.onClickAway)
                props.onClickAway(e);
        }

        function handleSubmit() {
            if (loading == false && name.valid) {
                actions
                    .createCard(name.value)
                    .then((data) => {
                        props.onClose(data, "created");
                        navigator.openCard(data);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
                setLoading(true);
            }
        }

        return (
            <Popper
                as="div"
                flip={flip}
                open={props.open}
                tabIndex={-1}
                anchorEl={props.anchorEl}
                placement="bottom-end"
                onClickAway={loading ? undefined : handleClickAway}
                className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 py-2 w-[294px] bg-white shadow-md overflow-x-hidden">
                <div className="flex flex-col py-2 px-4 items-center">
                    <Textarea.Input
                        autoFocus={true}
                        disabled={loading}
                        value={name.value}
                        onChange={name.setValue}
                        onSubmit={handleSubmit}
                        placeholder="Card name"
                        className="focus:border-primary-700 py-1.5 focus:shadow border-slate-500 border-2 px-2 w-full rounded-md mx-2 font-semibold text-base text-gray-900"
                    />
                </div>
                <div className="flex flex-col py-2 px-4 items-center">
                    <div
                        ref={dropdownRef}
                        role="button"
                        onClick={handleToggleDropdown}
                        className="bg-slate-200 py-2 px-2.5 cursor-pointer border-slate-200 w-full rounded-md mx-2 font-semibold text-sm text-gray-900 shadow-sm hover:shadow flex flex-row justify-between">
                        <span className="text-gray-600">Template</span>
                        <Icons.DropdownArrows className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
                <div className="flex flex-col py-2 px-4 items-center">
                    <button
                        onClick={handleSubmit}
                        disabled={name.valid!}
                        className={`${
                            name.valid ? "bg-primary-500" : "bg-primary-200"
                        } cursor-pointer py-2 px-2.5 border-slate-200 w-full rounded-md mx-2 font-semibold text-sm text-white shadow hover:shadow-md`}>
                        <span>Create</span>
                    </button>
                </div>
                <TemplateDropdown
                    open={dropdown}
                    anchorEl={dropdownRef.current}
                    onClickAway={handleTemplateDropdownClickAway}
                />
            </Popper>
        );
    }
);
