import React, { useState, useRef } from "react";
import { Popper, Text, Textarea } from "@colab/ui";
import * as Icons from "@colab/icons";
import { useNavigator } from "src/hooks";
import { useBoard } from "../hooks";
import { ColumnRecord, BoardRecord } from "@colab/store/lib/records";
import { useInput } from "src/utils";
import { useColumnActions } from "@workspace/Board/hooks";

interface ICreateCardPopper {
    column: ColumnRecord;
    onClose: (event: any, reason: string) => void;
}

interface IDropdownPopper {
    templates: BoardRecord["templates"];
    onSelect: (id: string) => void;
}

const flip = { flipVariations: false };

const TemplateDropdown = Popper.create<HTMLDivElement, IDropdownPopper>(
    (props) => {
        function handleTemplateClick(event: React.MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
        }

        return (
            <Popper
                as="div"
                flip={flip}
                open={props.open && !props.templates.isEmpty()}
                tabIndex={-1}
                portal={true}
                anchorEl={props.anchorEl}
                placement="bottom-end"
                data-popper="template-dropdown"
                style={{ width: props.anchorEl?.offsetWidth }}
                onClickAway={props.onClickAway}
                className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 max-h-56 bg-white shadow-md overflow-x-hidden z-20">
                <div
                    onClick={handleTemplateClick}
                    className="flex flex-col bg-slate-50">
                    {props.templates.map((template) => (
                        <div
                            key={template.id}
                            role="button"
                            onClick={() => props.onSelect(template.id)}
                            className="group flex flex-col hover:bg-primary-500 pl-3 pr-2 py-2">
                            <div className="flex flex-row items-center justify-between">
                                <div className="group-hover:text-white font-bold text-gray-800">
                                    <Text>{template.name}</Text>
                                </div>
                                <div className="font-bold text-gray-700 rounded-md bg-slate-200 w-6 h-4 text-center text-xs">
                                    {template.fields.size}
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 group-hover:text-gray-200 font-semibold">
                                <Text>{template.description}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            </Popper>
        );
    }
);

export default Popper.create<HTMLDivElement, ICreateCardPopper>(
    ({ column, ...props }) => {
        const actions = useColumnActions(column);

        const navigator = useNavigator();

        const board = useBoard();

        const dropdownRef = useRef<HTMLDivElement | null>(null);

        const [loading, setLoading] = useState<boolean>(false);

        const [dropdown, setDropdown] = useState<boolean>(false);

        const [templateid, setTemplateId] = useState("");

        const template = board.templates.find((temp) => temp.id === templateid);

        const name = useInput("", (val) => val.length >= 2);

        function isDropdownBtn(e: MouseEvent) {
            let btn = e.composedPath().find((el) => el === e.target);
            return Boolean(btn);
        }

        function handleToggleDropdown(e: React.MouseEvent) {
            if (isDropdownBtn(e.nativeEvent) && e.type === "click") {
                setDropdown((value) => !value && !loading);
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

        function handleSelectTemplate(id: string) {
            setDropdown(false);
            setTemplateId(id);
        }

        function handleClearTemplate(e: React.MouseEvent) {
            e.preventDefault();
            e.stopPropagation();
            setTemplateId("");
        }

        function handleSubmit() {
            if (loading == false && name.valid) {
                actions
                    .createCard(name.value, template?.id)
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
                className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 py-2 w-[294px] bg-white shadow-md overflow-x-hidden z-10">
                <div className="flex flex-col py-2 px-4 items-center">
                    <Textarea.Input
                        disabled={loading}
                        onSubmit={handleSubmit}
                        placeholder="Card name"
                        className="focus:border-primary-700 py-1.5 focus:shadow border-slate-500 border-2 px-2 w-full rounded-md mx-2 font-semibold text-base text-gray-900"
                        {...name.props}
                    />
                </div>
                <div className="flex flex-col py-2 px-4 items-center">
                    <div
                        ref={dropdownRef}
                        role="button"
                        onClick={handleToggleDropdown}
                        className="bg-slate-200 py-2 px-2.5 cursor-pointer border-slate-200 w-full rounded-md mx-2 font-semibold text-sm text-gray-900 shadow-sm hover:shadow flex flex-col justify-between">
                        {template ? (
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <span className="text-gray-600">
                                            <Text>{template.name}</Text>
                                        </span>
                                    </div>
                                    <button onClick={handleClearTemplate}>
                                        <Icons.CloseCircleSolid className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div>
                                    <Text>{template.description}</Text>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row justify-between">
                                <div>
                                    <span className="text-gray-600">
                                        Template
                                    </span>
                                </div>
                                <Icons.DropdownArrows className="h-5 w-5 text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col py-2 px-4 items-center">
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className={`${
                            name.valid && !loading
                                ? "bg-primary-500 shadow hover:shadow-md"
                                : "bg-primary-200"
                        } cursor-pointer py-2 px-2.5 border-slate-200 w-full rounded-md mx-2 font-semibold text-sm text-white`}>
                        <span>Create</span>
                    </button>
                </div>
                <TemplateDropdown
                    open={dropdown}
                    onSelect={handleSelectTemplate}
                    templates={board.templates}
                    anchorEl={dropdownRef.current}
                    onClickAway={handleTemplateDropdownClickAway}
                />
            </Popper>
        );
    }
);
