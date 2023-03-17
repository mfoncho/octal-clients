import React, { useState, useRef } from "react";
import * as Icons from "@colab/icons";
import { Dialog, Text, Textarea, Emoji, Button } from "@colab/ui";
import { SpaceRecord } from "@colab/store/lib/records";
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
    const name = useInput("");

    function handleCreateTopic(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        actions
            .createTopic({
                type: type,
                name: name.value,
            })
            .then((topic) => {
                navigator.openThread(topic);
                props.onClose(e);
            })
            .catch(() => {
                setLoading(false);
            });
    }

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
                            {name.value.length > 0
                                ? name.value
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
                <div className="relative flex flex-row">
                    <Textarea.Input
                        disabled={loading}
                        className="form-input focus:ring text-base font-semibold w-full text-gray-800 rounded-md border-gray-400"
                        {...name.props}
                    />
                </div>
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
