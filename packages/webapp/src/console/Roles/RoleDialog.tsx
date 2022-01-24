import React, { useState, useRef } from "react";
import { Dialog, Text, Emoji, Button } from "@octal/ui";
import client from "@console/client";
import { useInput } from "src/utils";
import { useNavigator } from "@console/hooks";

interface IDialog {}

export default Dialog.create<IDialog>((props) => {
    const navigator = useNavigator();
    const [loading, setLoading] = useState(false);
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [picker, setPicker] = useState<boolean>(false);

    const name = useInput("");

    const icon = useInput("");

    function handleCreateRole(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        client
            .createRole({ name: name.value.trim(), icon: icon.value })
            .then((data) => navigator.openRole(data))
            .catch(() => {});
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
            className="flex flex-col"
            maxWidth="xs"
            fullWidth={true}
            onClose={loading ? undefined : props.onClose}>
            <Dialog.Content className="flex flex-col">
                <span className="py-1 font-bold text-gray-800 text-xs">
                    ROLE NAME
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
                    disabled={!name.valid || !icon.valid || loading}
                    onClick={handleCreateRole}
                    color="primary">
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
