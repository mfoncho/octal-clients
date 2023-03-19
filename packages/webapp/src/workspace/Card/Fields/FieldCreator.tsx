import React from "react";
import * as Icons from "@colab/icons";
import { Popper, Dialog, Button } from "@colab/ui";
import { useActions } from "../hooks";
import { CardRecord } from "@colab/store";

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
        icon: Icons.Field.Text,
    },
    {
        name: "User",
        type: "user",
        icon: Icons.Field.Users,
    },
    {
        name: "Label",
        type: "label",
        icon: Icons.Field.Label,
    },
    {
        name: "Date",
        type: "datetime",
        icon: Icons.Field.DateTime,
    },
    {
        name: "Checklist",
        type: "checklist",
        icon: Icons.Field.Checklist,
    },
    {
        name: "Files",
        type: "file",
        icon: Icons.Field.File,
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
            className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 ring-opacity-5 min-w-[180px] bg-white shadow-md overflow-hidden divide-y">
            {options.map((opt) => (
                <button
                    onClick={(e) => props.onSelect(e, opt)}
                    key={opt.name}
                    className="flex hover:bg-primary-500 hover:text-white flex-row justify-between px-3 py-2 text-gray-700 items-center">
                    <span className="font-bold text-xs uppercase">
                        {opt.name}
                    </span>
                    {React.createElement(opt.icon, { className: "w-4 h-4" })}
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
        <div className="flex py-4 px-2 flex-row flex-wrap">
            <Button
                ref={btnRef}
                variant="icon"
                color="primary"
                onClick={dialog.opener("popper")}>
                <Icons.Plus className="w-6 h-6" />
            </Button>
            <FieldsPopper
                open={dialog.popper}
                onSelect={handleMenuSelect}
                anchorEl={btnRef.current}
                onClickAway={dialog.close}
            />
        </div>
    );
});
