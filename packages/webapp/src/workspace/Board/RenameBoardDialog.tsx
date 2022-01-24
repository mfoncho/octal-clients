import React, { useState, useRef } from "react";
import * as Icons from "@octal/icons";
import { Dialog, Text, Emoji, Button } from "@octal/ui";
import { BoardRecord } from "@octal/store/lib/records";
import { useInput, nameParts } from "src/utils";
import { useBoardActions } from "./hooks";

interface IRenameTopicDialog {
    board: BoardRecord;
}

export default Dialog.create<IRenameTopicDialog>((props) => {
    const actions = useBoardActions();
    const [loading, setLoading] = useState(false);
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [picker, setPicker] = useState<boolean>(false);
    const [iconPart, namePart] = nameParts(props.board.name);

    const name = useInput(namePart);

    const icon = useInput(iconPart);

    const namePreview = `${icon.value} ${name.value}`.trim();

    function handleCreateTopic(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        actions
            .updateBoard({
                name: namePreview,
            })
            .then(() => {
                props.onClose(e);
            })
            .catch(() => setLoading(false));
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key == "Backspace" && (e.target as any).selectionStart == 0) {
            icon.setValue("");
        }
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
                        <Text>
                            {namePreview.length > 0
                                ? namePreview
                                : "Create a new topic"}
                        </Text>
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
                    <input
                        disabled={loading}
                        className="form-input font-semibold w-full text-gray-800 pl-11 rounded-md border-gray-400"
                        {...name.props}
                        onKeyUp={handleKeyPress}
                    />
                    <div className="absolute h-full py-2 px-1.5 flex items-center justify-center">
                        <Button
                            ref={iconBtnRef}
                            disabled={loading}
                            className="text-lg"
                            onClick={(e) => setPicker(true)}
                            variant="icon">
                            <Text>{icon.value}</Text>
                        </Button>
                    </div>
                </div>
                <Emoji.Picker.Popper
                    open={picker}
                    anchorEl={iconBtnRef.current}
                    placement="top-start"
                    onSelect={(val) => {
                        icon.setValue(val);
                        setPicker(false);
                    }}
                    onClickAway={() => setPicker(false)}
                />
            </Dialog.Content>
            <Dialog.Actions className="rounded-b-lg">
                <Button
                    disabled={
                        name.value.trim().length == 0 ||
                        (!name.valid && !icon.valid) ||
                        namePreview.length == 0 ||
                        namePreview == props.board.name ||
                        loading
                    }
                    onClick={handleCreateTopic}
                    color="primary">
                    Update
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
