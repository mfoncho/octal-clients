import React, { useState } from "react";
import { Text } from "@colab/ui";
import StatusDialog from "../StatusDialog";
import { useUser } from "@colab/store";

export default React.memo(function Status() {
    const [dialog, setDialog] = useState(false);
    const user = useUser();
    return (
        <React.Fragment>
            <button
                onClick={() => setDialog(!dialog)}
                className="p-2 border-2 border-gray-300 hover:bg-gray-200 bg-gray-100 rounded-md">
                {user.status.text.length > 0 ? (
                    <span>
                        <Text>{`${user.status.icon} ${user.status.text}`}</Text>
                    </span>
                ) : (
                    <span className="px-2 text-base font-bold">status</span>
                )}
            </button>
            <StatusDialog open={dialog} onClose={() => setDialog(false)} />
        </React.Fragment>
    );
});
