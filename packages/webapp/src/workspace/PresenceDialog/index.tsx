import React from "react";
import * as Icons from "@octal/icons";
import { Dialog } from "@octal/ui";
import { useDispatch } from "react-redux";
import { setPresence } from "@octal/store/lib/actions/user";
import { usePresence } from "@octal/store";
import { presence as colors } from "src/utils";
import { io } from "@octal/client";

interface IPresenceType {
    name: string;
    value: io.PresenceState;
}

const ptypes: IPresenceType[] = [
    {
        name: "Online",
        value: "online",
    },
    {
        name: "Do not Disturb",
        value: "dnd",
    },
    {
        name: "Away",
        value: "away",
    },
    {
        name: "Busy",
        value: "busy",
    },
    {
        name: "Offline",
        value: "offline",
    },
];

interface IPresenceDialog {}

export default Dialog.create<IPresenceDialog>((props) => {
    const presence = usePresence();

    const dispatch = useDispatch();

    function handleSetPresence(presence: io.PresenceState) {
        const action = setPresence({ presence });
        dispatch(action);
    }

    return (
        <Dialog
            title="Presence"
            open={props.open}
            maxWidth="xs"
            fullWidth={false}
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col pb-8 w-72">
                {ptypes.map((pre) => (
                    <div
                        key={pre.value}
                        role="button"
                        onClick={() => handleSetPresence(pre.value)}
                        className="flex py-2 pr-2 text-gray-700 flex-row hover:bg-primary-500 hover:text-white items-center rounded-md justify-between">
                        <div className="flex flex-row flex-1">
                            <div
                                className="w-4 h-4 mx-2 my-px shadow rounded-full"
                                style={{
                                    backgroundColor: colors.get(pre.value),
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                    {pre.name}
                                </span>
                            </div>
                        </div>
                        {pre.value == presence.state && (
                            <Icons.Check className="h-5 w-5" />
                        )}
                    </div>
                ))}
            </Dialog.Content>
        </Dialog>
    );
});
