import React, { useState, useRef, useEffect } from "react";
import { Dialog, Text, Emoji, Button } from "@colab/ui";
import * as Icons from "@colab/icons";
import emoji from "@colab/emoji";
import { Actions } from "@colab/store";
import { useStatus, useUser } from "@colab/store";
import { useDispatch } from "react-redux";
import { useInput } from "src/utils";

interface IDialog {
    open: boolean;
    onClose: () => void;
}

export default React.memo<IDialog>((props) => {
    const user = useUser();
    const dispatch = useDispatch();
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [picker, setPicker] = useState<boolean>(false);

    const icon = useInput(user.status.icon ?? "");
    const text = useInput(user.status.text);

    useEffect(() => {
        icon.setValue(user.status.icon ?? "");
        text.setValue(user.status.text);
    }, [user.status.icon, user.status.text]);

    function updateUserStatus(_event: React.MouseEvent) {
        const action = Actions.User.setUserStatus(user.id, {
            icon: icon.value,
            text: text.value,
            timeout: 0,
        });
        dispatch(action);
    }

    const hasChanges =
        user.status.icon !== icon.value ||
        user.status.text !== text.value.trim();

    return (
        <Dialog.Base
            open={props.open}
            fullScreen={false}
            maxWidth="xs"
            className="flex flex-col"
            fullWidth={true}
            onClose={props.onClose}>
            <div className="flex max-w-full flex-none flex-row h-20 px-6 items-center justify-between">
                <span className="font-extrabold truncate text-xl px-2 text-gray-800">
                    Set Status
                </span>
                <button
                    className="ml-2 rounded-md hover:bg-gray-200 w-8 h-8 flex justify-center items-center"
                    onClick={props.onClose}>
                    <Icons.Close />
                </button>
            </div>
            <Dialog.Content className="flex flex-col">
                <div className="relative flex flex-row">
                    <input
                        className="form-input font-semibold w-full text-gray-800 pl-11 rounded-md border-gray-400"
                        {...text.props}
                    />
                    <div className="absolute h-full py-2 px-1.5 flex items-center justify-center">
                        <Button
                            ref={iconBtnRef}
                            className="text-lg"
                            onClick={() => setPicker(true)}
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
                    onClick={updateUserStatus}
                    disabled={!hasChanges}
                    color="primary">
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
