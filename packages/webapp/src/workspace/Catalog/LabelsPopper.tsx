import React, { useState, useRef } from "react";
import Label from "@workspace/Catalog/Label";
import * as Icons from "@colab/icons";
import { useInput } from "src/utils";
import { LabelRecord } from "@colab/store/lib/records";
import { Popper, Emoji, Text, Button, Dialog, Textarea } from "@colab/ui";
import { useLabels, useCatalogActions } from "@workspace/Catalog/hooks";

interface ILabelsPopper {
    selected?: string[];
    onSelect?: (label: LabelRecord) => void;
}

interface ILabels {
    selected?: string[];
    onSelect?: (label: LabelRecord) => void;
}

interface IFormPayload {
    name: string;
    color: string;
}

interface ILabelForm {
    name?: string;
    color?: string;
    disabled?: boolean;
    onClose: (e: React.MouseEvent) => void;
    onSubmit: (params: IFormPayload) => void;
}

interface ICustomEvent<T> {
    target: {
        value: T;
    };
}

interface IColor {
    value: string;
    disabled?: boolean | null;
    onSelect?: ((val: ICustomEvent<string>) => void) | null;
    selected?: boolean | null;
}

const labelStyle = { margin: 0 };

const colors: string[] = [
    "#f44336",
    "#2196f3",
    "#9e9e9e",
    "#e91e63",
    "#009688",
    "#795548",
    "#4caf50",
    "#ffc107",
    "#ffeb3b",
    "#ff9800",
    "#9c27b0",
    "#3f51b5",
    "#607d8b",
    "#673ab7",
    //"#ff5722",
];

const flip = { flipVariations: false };

interface IDialog {
    label: LabelRecord;
}

const warning = `Some records might be unlabeled`;

const Warning = Dialog.create<IDialog>((props) => {
    const [label] = useState(props.label);
    const [loading, setLoading] = useState(false);

    const actions = useCatalogActions();

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.deleteLabel(label.id).catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col p-2">
                <Label name={label.name} color={label.color} />
                <span className="my-2 text-sm text-gray-600 font-semibold">
                    {warning}
                </span>
            </div>
            <div className="flex flex-row justify-between py-2 px-2 bg-gray-100">
                <Button
                    color="clear"
                    disabled={loading}
                    onClick={props.onClose}>
                    Cancel
                </Button>
                <Button
                    color="danger"
                    disabled={loading}
                    onClick={handleConfirm}>
                    Delete
                </Button>
            </div>
        </div>
    );
});

function Color(props: IColor) {
    const styles = {
        backgroundColor: props.value,
    };
    function handleClick(e: React.MouseEvent) {
        if (props.onSelect) {
            e.stopPropagation();
            e.preventDefault();
            props.onSelect({ target: { value: props.value } });
        }
    }
    return (
        <div
            onClick={handleClick}
            className="flex flex-col justify-center items-center h-7 h-7 rounded-lg"
            style={styles}>
            {props.selected ? <Icons.Check className="text-white" /> : null}
        </div>
    );
}

function LabelForm(props: ILabelForm) {
    const name = useInput(props.name ?? "");
    const color = useInput(props.color ?? colors[0]);
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [epicker, setEpicker] = useState<boolean>(false);

    function handleColorChange(e: ICustomEvent<string>) {
        color.setValue(e.target.value);
    }

    function handleSubmit(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        props.onSubmit({
            name: name.value.trim(),
            color: color.value,
        });
    }

    return (
        <div className="flex flex-col">
            <div className="relative flex flex-row overflow-hidden">
                <Textarea.Input
                    className="form-input w-full max-w-full font-semibold text-gray-800 m-2 rounded-md focus:ring border-1.5 focus:border-primary-400 text-base"
                    {...name.props}
                />
            </div>
            <div className="grid gap-2 grid-flow-row grid-cols-7 p-2">
                {colors.map((col) => {
                    return (
                        <Color
                            key={col}
                            value={col}
                            disabled={props.disabled}
                            selected={col == color.value}
                            onSelect={handleColorChange}
                        />
                    );
                })}
            </div>
            <div className="flex flex-row justify-between py-2 px-2 bg-gray-100">
                <Button
                    color="clear"
                    onClick={props.onClose}
                    disabled={props.disabled}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={
                        name.value.trim().length == 0 ||
                        color.value.trim().length == 0 ||
                        (props.name === name.value.trim() &&
                            color.value === props.color)
                    }
                    color="primary">
                    Save
                </Button>
            </div>
            <Emoji.Picker.Popper
                open={epicker}
                anchorEl={iconBtnRef.current}
                onSelect={(val) => {
                    name.setValue((name) => name + val);
                    setEpicker(false);
                }}
                onHoverAway={() => setEpicker(false)}
                onClickAway={() => setEpicker(false)}
            />
        </div>
    );
}

function Labels(props: ILabels) {
    const labels = useLabels();
    const actions = useCatalogActions();
    const { selected = [] } = props;
    const [edit, setEdit] = useState<string>("");
    const [warn, setWarn] = useState<string>("");
    const label = labels.find((label) => label.id == edit);
    const warned = labels.find((label) => label.id == warn);

    function openEditor(id: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setEdit(id);
        };
    }

    function openWarning(id: string) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setWarn(id);
        };
    }

    function closeWarning() {
        setWarn("");
    }

    function closeEditor(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setEdit("");
    }

    function handleUpdateLabel(params: IFormPayload) {
        if (label) {
            actions.updateLabel(label.id, params).then(() => setEdit(""));
        }
    }

    function handleLabelClick(label: LabelRecord) {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (props.onSelect) {
                props.onSelect(label);
            }
        };
    }

    if (warned) {
        return (
            <Warning
                label={warned!}
                open={Boolean(warned)}
                onClose={closeWarning}
            />
        );
    }

    if (label) {
        return (
            <LabelForm
                name={label.name}
                color={label.color}
                onClose={closeEditor}
                onSubmit={handleUpdateLabel}
            />
        );
    }

    return (
        <div className="flex flex-col max-h-[250px] overflow-y-auto overflow-x-hidden  divide-y dark:divide-slate-100/5">
            {labels.map((label) => {
                const selctd = selected.includes(label.id);
                return (
                    <div
                        key={label.id}
                        role="button"
                        onClick={handleLabelClick(label)}
                        className="group flex cursor-pointer hover:bg-slate-100 flex-row items-center justify-between p-2">
                        <div className="flex flex-row items-center space-x-2">
                            <input
                                checked={selctd}
                                readOnly={true}
                                className="form-checkbox border-4 rounded-full w-4 h-4 mx-1"
                                type="checkbox"
                                style={{
                                    color: label.color,
                                    borderColor: label.color,
                                }}
                            />
                            <span className="font-semibold text-sm text-gray-700">
                                <Text>{label.name}</Text>
                            </span>
                        </div>

                        <div className="invisible group-hover:visible flex flex-row items-center justify-end">
                            <button
                                className="mx-1"
                                onClick={openEditor(label.id)}>
                                <Icons.Edit
                                    fontSize="small"
                                    className="text-gray-400"
                                />
                            </button>
                            <button
                                onClick={openWarning(label.id)}
                                className="mx-1">
                                <Icons.Delete
                                    fontSize="small"
                                    className="text-gray-400"
                                />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Popper.create<HTMLDivElement, ILabelsPopper>((props) => {
    const actions = useCatalogActions();
    const [form, setForm] = useState<boolean>(false);
    function closeForm(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setForm(false);
    }

    function openForm(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setForm(true);
    }

    function handleCreateLabel(params: IFormPayload) {
        actions.createLabel(params).then(() => setForm(false));
    }

    function handlePopperClickAway(e: MouseEvent) {
        let suggestion = e.composedPath().find((el: any) => {
            if (el.getAttribute) {
                return el.getAttribute("data-suggestion-type") === "emoji";
            }
            return false;
        });
        if (!Boolean(suggestion) && props.onClickAway) {
            props.onClickAway(e);
        }
    }

    return (
        <Popper
            as="div"
            flip={flip}
            open={props.open}
            tabIndex={-1}
            style={labelStyle}
            anchorEl={props.anchorEl}
            placement="bottom-start"
            onClickAway={handlePopperClickAway}
            className="focus:outline-none flex flex-col rounded-md ring-1 ring-gray-800 z-[1000] ring-opacity-5 min-w-[264px] max-w-[264px] overflow-hidden bg-white shadow-md bg-slate-50">
            {form ? (
                <LabelForm onClose={closeForm} onSubmit={handleCreateLabel} />
            ) : (
                <>
                    <Labels
                        selected={props.selected}
                        onSelect={props.onSelect}
                    />
                    <div className="flex rounded-b-md flex-col py-2 px-2 bg-gray-100">
                        <Button
                            className="flex flex-row justify-center"
                            onClick={openForm}
                            color="primary">
                            <Icons.Plus className="text-white" />
                        </Button>
                    </div>
                </>
            )}
        </Popper>
    );
});
