import React, { useState } from "react";
import Actions from "./Actions";
import * as Icons from "@colab/icons";
import { RecordRecord } from "@colab/store/lib/records";
import { useAuthId } from "@colab/store";
import { useInput } from "src/utils";
import { Button, Text, useScreen, Textarea } from "@colab/ui";
import { usePermissions } from "@workspace/Space";
import { useActions } from "@workspace/Catalog/Record";
import { useCatalog } from "@workspace/Catalog";

interface IHeader {
    record: RecordRecord;
    onClose: (e: React.MouseEvent) => void;
}

interface IEdit {
    value: string;
    disabled?: boolean;
    onClose: (...e: any) => void;
    onSubmit: (value: string) => void;
}

function Edit({ value, onSubmit, onClose }: IEdit) {
    const name = useInput(value);

    function handleKeyPress() {
        onSubmit(name.value);
        onClose();
    }

    return (
        <Textarea.Input
            {...name.props}
            autoFocus
            onBlur={onClose}
            className="w-full max-w-full px-2 sm:py-0 focus:ring focus:text-gray-900 text-left text-2xl text-gray-700 font-black"
            onSubmit={handleKeyPress}
        />
    );
}

export default function Header({ record, ...props }: IHeader) {
    const authId = useAuthId();

    const screen = useScreen();

    const [updating, setUpdating] = useState(false);

    const actions = useActions();

    const catalog = useCatalog();

    const permissions = usePermissions();

    const [editing, setEditing] = useState<boolean>(false);

    let owner = record.user_id == authId;

    function handleRename(name: string) {
        actions.updateRecord({ name }).finally(() => setUpdating(false));
        setUpdating(true);
    }

    function handleSetEditingMode() {
        setEditing(true && !record.archived);
    }

    function handleCloseEditingMode() {
        setEditing(false);
    }

    return (
        <div className="flex px-4  py-4 flex-row justify-between">
            <div className="relative group flex-1 flex flex-row items-start sm:items-center">
                {owner && editing && !catalog.is_archived ? (
                    <Edit
                        value={record.name}
                        onSubmit={handleRename}
                        disabled={updating}
                        onClose={handleCloseEditingMode}
                    />
                ) : (
                    <div className="flex px-2 flex-col justify-center">
                        <span
                            role="button"
                            className="overflow-wrap-anywhere text-left text-2xl text-gray-800 font-black">
                            <Text>{record.name}</Text>
                        </span>
                        <div className="absolute -top-1.5 -left-1.5 group-hover:visible invisible">
                            <button
                                onClick={
                                    owner && !catalog.is_archived
                                        ? handleSetEditingMode
                                        : undefined
                                }
                                className="hover:bg-primary-600 hover:text-white px-1  rounded-full">
                                <Icons.Edit className="h-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="md:flex-1 flex flex-col items-end justify-start">
                <div className="flex flex-row">
                    {(screen.tablet || screen.desktop) && (
                        <Actions record={record} onClose={props.onClose} />
                    )}

                    <Button variant="icon" onClick={props.onClose}>
                        <Icons.Close className="text-gray-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
