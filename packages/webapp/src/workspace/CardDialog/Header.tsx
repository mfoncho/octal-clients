import React, { useState } from "react";
import Actions from "./Actions";
import * as Icons from "@octal/icons";
import { CardRecord } from "@octal/store/lib/records";
import { useAuthId } from "@octal/store";
import { useInput } from "src/utils";
import { Button, Text, useScreen } from "@octal/ui";
import { KeyboardInputEvent } from "src/types";
import { usePermissions, useSpace } from "@workspace/Space";
import { useActions } from "@workspace/Board/Card";

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

function Edit({ disabled, value, onSubmit, onClose }: IEdit) {
    const name = useInput(value);

    function handleKeyPress(e: KeyboardInputEvent) {
        if (e.key == "Enter" && name.valid) {
            onSubmit(name.value);
            onClose();
        }
    }

    return (
        <input
            {...name.props}
            autoFocus
            onBlur={onClose}
            disabled={disabled}
            className="px-2 focus:outline-none focus:text-gray-800 text-left text-2xl text-gray-700 font-black"
            onKeyPress={handleKeyPress}
        />
    );
}

export default function Header({ card, ...props }: IHeader) {
    const authId = useAuthId();

    const screen = useScreen();

    const [updating, setUpdating] = useState(false);

    const actions = useActions();

    const board = useSpace();

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
            <div className="flex flex-row items-start sm:items-center">
                {owner && editing && !board.is_archived ? (
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
                            onClick={
                                owner && !board.is_archived
                                    ? handleSetEditingMode
                                    : undefined
                            }
                            className="text-left text-2xl text-gray-800 font-black">
                            <Text>{card.name}</Text>
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-row justify-end items-start sm:items-center">
                {(screen.tablet || screen.desktop) && (
                    <Actions card={card} onClose={props.onClose} />
                )}

                <Button variant="icon" onClick={props.onClose}>
                    <Icons.Close className="text-gray-500" />
                </Button>
            </div>
        </div>
    );
}
