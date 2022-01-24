import React from "react";
import { Popper, Dialog } from "@octal/ui";
import { useActions } from "../hooks";
import { MdOutlineAddCircleOutline as AddIcon } from "react-icons/md";
import { CardRecord } from "@octal/store";

interface IOption {
    type: string;
    name: string;
    [key: string]: any;
}

interface IPopper {
    loading?: boolean;
    onSelect: (e: React.MouseEvent<HTMLButtonElement>, opt: IOption) => void;
}

const options: IOption[] = [
    {
        name: "Text",
        type: "text",
    },
    {
        name: "User",
        type: "user",
    },
    {
        name: "Label",
        type: "label",
    },
    {
        name: "Date & Time",
        type: "datetime",
    },
    {
        name: "Checklist",
        type: "checklist",
    },
    {
        name: "Number",
        type: "number",
    },
];

const FieldsPopper = Popper.create<HTMLDivElement, IPopper>((props) => {
    return (
        <Popper
            as="div"
            open={props.open}
            tabIndex={-1}
            anchorEl={props.anchorEl}
            placement="bottom-start"
            onClickAway={props.onClickAway}
            className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 min-w-[200px] p-2 bg-white shadow-md">
            {options.map((opt) => (
                <button
                    onClick={(e) => props.onSelect(e, opt)}
                    key={opt.name}
                    className="flex hover:bg-primary-500 hover:text-white flex-row justify-between px-2 py-1 rounded-md">
                    <span className="font-semibold text-sm">{opt.name}</span>
                </button>
            ))}
        </Popper>
    );
});

export default React.memo<{ card: CardRecord }>((props) => {
    const dialog = Dialog.useDialog();
    const actions = useActions(props.card);
    const btnRef = React.useRef<HTMLButtonElement | null>(null);

    function handleMenuSelect(event: React.MouseEvent, option: IOption) {
        dialog.close(event);
        let { type, name } = option;
        actions.createField({ type, name });
    }

    return (
        <div className="flex py-4 flex-row flex-wrap">
            <button
                ref={btnRef}
                onClick={dialog.opener("popper")}
                className="font-bold text-gray-600">
                <AddIcon className="w-6 h-6" />
            </button>
            <FieldsPopper
                open={dialog.popper}
                onSelect={handleMenuSelect}
                anchorEl={btnRef.current}
                onClickAway={dialog.close}
            />
        </div>
    );
});
