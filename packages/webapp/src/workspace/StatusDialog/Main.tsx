import React, { useState, useRef } from "react";
import { Dialog, Text, Emoji, Button } from "@octal/ui";
import * as Icons from "@octal/icons";
import emoji from "@octal/emoji";
import { setUserStatus } from "@octal/store/lib/actions/user";
import { useStatus, useAuthId } from "@octal/store";
import { useDispatch } from "react-redux";
import { useInput } from "src/utils";

interface IDialog {
    open: boolean;
    onClose: () => void;
}

export default React.memo<IDialog>((props) => {
    const aid = useAuthId();
    const dispatch = useDispatch();
    const ustatus = emoji.prefixed(useStatus());
    const iconBtnRef = useRef<HTMLButtonElement>(null);
    const [picker, setPicker] = useState<boolean>(false);

    const icon = useInput(ustatus[0]);
    const status = useInput(ustatus[1]);

    function updateUserStatus(_event: React.MouseEvent) {
        const action = setUserStatus(aid, {
            status: `${icon.value} ${status.value}`,
        });
        dispatch(action);
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
                        {...status.props}
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
                    disabled={!status.valid && !icon.valid}
                    color="primary">
                    Set
                </Button>
            </Dialog.Actions>
        </Dialog.Base>
    );
});
