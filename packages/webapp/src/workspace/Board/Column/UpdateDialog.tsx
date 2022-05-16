import React, { useState } from "react";
import clx from "classnames";
import { Textarea } from "@octal/ui";
import { Switch, Dialog, Button, Range } from "@octal/ui";
import { useInput } from "src/utils";
import { ColumnRecord } from "@octal/store/lib/records";
import { useColumnActions } from "../hooks";

const types: { type: "stack" | "queue"; description: string }[] = [
    {
        type: "stack",
        description: "cards are added to the top of the column",
    },
    {
        type: "queue",
        description: "cards are added to the bottom of the column",
    },
];

interface IDialog {
    column: ColumnRecord;
}

export default Dialog.create<IDialog>(({ column, ...props }) => {
    const actions = useColumnActions(column);

    const [origin, setOrigin] = useState<boolean>(column.origin);

    const [type, setType] = useState<"stack" | "queue">(column.type);

    const [loading, setLoading] = useState(false);

    const name = useInput(column.name, (value) => value.length >= 3);

    const capacity = useInput<string>(
        String(column.capacity),
        (cap) => cap >= "1"
    );

    function handleSaveColumn() {
        actions
            .update({
                name: name.value,
                type: type,
                origin: origin,
                capacity: Number(capacity.value),
            })
            .then(() => props.onClose({}, "updated"))
            .catch(() => setLoading(false));

        setLoading(true);
    }

    function handleTypeChange(type: "stack" | "queue") {
        return () => {
            setType(type);
        };
    }

    function handleToggleOrigin() {
        setOrigin((origin) => !origin);
    }

    function handleCapacityChange(e: React.ChangeEvent<{}>, value: any) {
        capacity.setValue(value);
    }

    function hasChanges() {
        return (
            type != column.type ||
            column.origin != origin ||
            name.value != column.name ||
            parseInt(capacity.value) != column.capacity
        );
    }

    return (
        <Dialog
            title="Update Column"
            maxWidth="xs"
            open={props.open}
            fullWidth={false}
            onClose={loading ? undefined : props.onClose}>
            <Dialog.Content className="flex flex-col">
                <div className="flex flex-row">
                    <Textarea.Input
                        autoFocus={true}
                        value={name.value}
                        disabled={loading}
                        onChange={name.setValue}
                        placeholder="Column name"
                        className="mx-0 focus:border-primary-700 py-1.5 focus:shadow border-slate-500 border-2 px-2 w-full rounded-md mx-2 font-semibold text-base text-gray-900"
                    />
                </div>

                <div className="flex flex-col pt-2">
                    <Range
                        max={100}
                        min={1}
                        valueLabelDisplay="on"
                        value={parseInt(capacity.value)}
                        onChange={handleCapacityChange}
                    />
                </div>

                <div className="flex flex-row py-4 first-child:mr-2 last-child:ml-2">
                    {types.map((col) => {
                        const selected = col.type == type;
                        return (
                            <button
                                key={col.type}
                                onClick={handleTypeChange(col.type)}
                                className={clx(
                                    "flex flex-col text-left items-start p-4 rounded-md",
                                    selected
                                        ? "bg-primary-500 text-white"
                                        : "bg-gray-100"
                                )}>
                                <span className="text-base capitalize font-semibold">
                                    {col.type}
                                </span>
                                <span
                                    className={clx(
                                        "text-sm",
                                        !selected && "text-gray-500"
                                    )}>
                                    {col.description}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-row items-center py-4 justify-between">
                    <div className="flex flex-col pr-8">
                        <span className="font-semibold">Origin</span>
                        <span className="text-sm text-gray-500">
                            New cards can only be created on origin columns
                        </span>
                    </div>

                    <Switch
                        disabled={loading}
                        checked={origin}
                        onChange={handleToggleOrigin}
                    />
                </div>
            </Dialog.Content>

            <Dialog.Actions>
                <Button
                    disabled={
                        !(name.valid && capacity.valid && hasChanges()) ||
                        loading
                    }
                    onClick={handleSaveColumn}
                    color="primary">
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});
