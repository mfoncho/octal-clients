import React from "react";
import { Text, Dialog, Tooltip } from "@octal/ui";
import { useUser, usePresence, useStatus } from "@octal/store";
import StatusDialog from "../StatusDialog";
import { presence as colors } from "src/colors";
import { GoPrimitiveDot as PresenceDotIcon } from "react-icons/go";

interface IPresence {
    className?: string;
}

const Status = React.memo<{}>(() => {
    const { icon, status } = useStatus();
    if (Boolean(icon) && Boolean(status)) {
        return (
            <Tooltip
                placement="top"
                title={<span className="text-xs font-bold">{status}</span>}>
                <span>
                    <Text>{icon}</Text>
                </span>
            </Tooltip>
        );
    }
    return <span />;
});

const Presence = React.memo<IPresence>((props) => {
    const presence = usePresence();
    return (
        <PresenceDotIcon
            className={props.className}
            style={{ color: colors.get(presence.state) }}
        />
    );
});

export default React.memo(() => {
    const user = useUser();

    const dialog = Dialog.useDialog();
    return (
        <button
            onClick={dialog.opener("status")}
            className="flex flex-row items-center">
            <Presence className="w-4 h-4" />
            <span className="text-sm font-semibold text-gray-700 pr-2 ">
                {user.username}
            </span>
            <Status />
            <StatusDialog open={dialog.status} onClose={dialog.close as any} />
        </button>
    );
});
