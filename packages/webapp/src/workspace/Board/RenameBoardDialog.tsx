import React, { useState } from "react";
import * as Icons from "@octal/icons";
import { Dialog, Text, Textarea, Button } from "@octal/ui";
import { BoardRecord } from "@octal/store/lib/records";
import { useInput } from "src/utils";
import { useBoardActions } from "./hooks";

interface IRenameTopicDialog {
    board: BoardRecord;
}

export default Dialog.create<IRenameTopicDialog>((props) => {
    const actions = useBoardActions();
    const [loading, setLoading] = useState(false);

    const name = useInput(props.board.name);

    function handleRenameBoard(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        actions
            .updateBoard({
                name: name.value.trim(),
            })
            .then(() => {
                props.onClose(e);
            })
            .catch(() => setLoading(false));
    }

    return (
        <Dialog.Base
            open={props.open}
            fullScreen={false}
            maxWidth="xs"
            className="flex flex-col"
            fullWidth={true}
            onClose={props.onClose}>
            <div className="flex max-w-full flex-none flex-row h-20 px-6 items-center justify-between">
                <div className="flex flex-row items-center overflow-hidden">
                    <Icons.Board className="h-6 w-6 text-primary-500" />
                    <span className="font-extrabold truncate text-xl px-2 text-gray-800">
                        <Text>{name.value.trim()}</Text>
                    </span>
                </div>
                <button
                    className="ml-2 rounded-md hover:bg-gray-200 w-8 h-8 flex justify-center items-center"
                    onClick={props.onClose}>
                    <Icons.Close />
                </button>
            </div>
            <Dialog.Content className="flex flex-col">
                <div className="relative flex flex-row">
                    <Textarea.Input
                        disabled={loading}
                        className="form-input focus:ring text-base font-semibold w-full text-gray-800 rounded-md border-gray-400"
                        value={name.value}
                        onChange={name.setValue}
                    />
                </div>
            </Dialog.Content>
            <Dialog.Actions className="rounded-b-lg">
                <Button
                    disabled={
                        name.value.trim() === props.board.name.trim() || loading
                    }
                    onClick={handleRenameBoard}
                    color="primary">
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
