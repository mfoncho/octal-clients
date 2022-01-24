import React, { useState, useRef } from "react";
import * as Icons from "@octal/icons";
import { Dialog, Text, Emoji, Button } from "@octal/ui";
import { SpaceRecord } from "@octal/store/lib/records";
import { useNavigator } from "src/hooks";
import { useInput } from "src/utils";
import { useActions } from "./hooks";

interface IDialog {
    space: SpaceRecord;
}

export default Dialog.create<IDialog>((props) => {
    const actions = useActions(props.space);
    const navigator = useNavigator();
    const [type] = useState<string>("chat");
    const [loading, setLoading] = useState(false);
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [picker, setPicker] = useState<boolean>(false);

    const name = useInput("");

    const icon = useInput("");

    function handleCreateTopic(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        actions
            .createTopic({
                type: type,
                name: (icon.valid
                    ? `${icon.value} ${name.value}`
                    : name.value
                ).trim(),
            })
            .then((topic) => {
                navigator.openTopic(topic);
                props.onClose(e);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key == "Backspace" && (e.target as any).selectionStart == 0) {
            icon.setValue("");
        }
    }

    const namePreview = `${icon.value} ${name.value}`.trim();

    return (
        <Dialog.Base
            open={props.open}
            fullScreen={false}
            maxWidth="xs"
            className="flex flex-col"
            fullWidth={true}
            onClose={loading ? undefined : props.onClose}>
            <div className="flex max-w-full flex-none flex-row h-20 px-6 items-center justify-between">
                <div className="flex flex-row items-center">
                    <Icons.Topic className="h-6 w-6 text-gray-500" />
                    <span className="font-extrabold text-xl px-2 text-gray-800">
                        <Text>
                            {namePreview.length > 0
                                ? namePreview
                                : "Create Topic"}
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
                <span className="py-1 font-semibold text-gray-800 text-xs">
                    TOPIC NAME
                </span>
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
                    disabled={!name.valid || loading}
                    onClick={handleCreateTopic}
                    color="primary">
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
