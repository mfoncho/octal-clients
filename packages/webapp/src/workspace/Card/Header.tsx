import React, { useState } from "react";
import Actions from "./Actions";
import * as Icons from "@colab/icons";
import { CardRecord } from "@colab/store/lib/records";
import { useAuthId } from "@colab/store";
import { useInput } from "src/utils";
import { Button, Text, useScreen, Textarea } from "@colab/ui";
import { usePermissions } from "@workspace/Space";
import { useActions } from "@workspace/Board/Card";
import { useBoard } from "@workspace/Board";

interface IHeader {
    card: CardRecord;
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

export default function Header({ card, ...props }: IHeader) {
    const authId = useAuthId();

    const screen = useScreen();

    const [updating, setUpdating] = useState(false);

    const actions = useActions();

    const board = useBoard();

    const permissions = usePermissions();

    const [editing, setEditing] = useState<boolean>(false);

    let owner = card.user_id == authId;

    function handleRename(name: string) {
        actions.updateCard({ name }).finally(() => setUpdating(false));
        setUpdating(true);
    }

    function handleSetEditingMode() {
        setEditing(true && !card.archived);
    }

    function handleCloseEditingMode() {
        setEditing(false);
    }

    return (
        <div className="flex px-4  py-4 flex-row justify-between">
            <div className="relative group flex-1 flex flex-row items-start sm:items-center">
                {owner && editing ? (
                    <Edit
                        value={card.name}
                        onSubmit={handleRename}
                        disabled={updating}
                        onClose={handleCloseEditingMode}
                    />
                ) : (
                    <div className="flex px-2 flex-col justify-center">
                        <span
                            role="button"
                            className="overflow-wrap-anywhere text-left text-2xl text-gray-800 font-black">
                            <Text>{card.name}</Text>
                        </span>
                        <div className="absolute -top-1.5 -left-1.5 group-hover:visible invisible">
                            <button
                                onClick={
                                    owner ? handleSetEditingMode : undefined
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
                        <Actions card={card} onClose={props.onClose} />
                    )}

                    <Button variant="icon" onClick={props.onClose}>
                        <Icons.Close className="text-gray-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
