import React from "react";
import { Text, Dialog, Tooltip } from "@colab/ui";
import emoji from "@colab/emoji";
import { useUser } from "@colab/store";
import StatusDialog from "../StatusDialog";

const Status = React.memo<{ status: string }>((props) => {
    const [icon, status] = emoji.prefixed(props.status);
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

export default React.memo(() => {
    const user = useUser();

    const dialog = Dialog.useDialog();
    return (
        <button
            onClick={dialog.opener("status")}
            className="flex flex-row items-center">
            <span className="text-sm font-semibold text-primary-100 pr-2 ">
                {user.username}
            </span>
            <Status status={user.status} />
            <StatusDialog open={dialog.status} onClose={dialog.close as any} />
        </button>
    );
});
