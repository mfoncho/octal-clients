import React from "react";
import { Text, Dialog, Tooltip } from "@colab/ui";
import { useUser } from "@colab/store";
import StatusDialog from "../StatusDialog";

const Status = React.memo<{ icon: string; text: string }>((props) => {
    if (Boolean(props.icon)) {
        return (
            <Tooltip
                placement="top"
                title={<span className="text-xs font-bold">{props.text}</span>}>
                <span>
                    <Text>{props.icon}</Text>
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
            <Status icon={user.status.icon} text={user.status.text} />
            <StatusDialog open={dialog.status} onClose={dialog.close as any} />
        </button>
    );
});
