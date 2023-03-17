import React, { useState } from "react";
import { Text } from "@colab/ui";
import StatusDialog from "../StatusDialog";
import { useUser } from "@colab/store";

export default React.memo(function Status() {
    const [dialog, setDialog] = useState(false);
    const user = useUser();
    return (
        <React.Fragment>
            <button onClick={() => setDialog(!dialog)}>
                {user.status ? (
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                        <Text>{user.status.toString()}</Text>
                    </span>
                ) : (
                    <span className="px-2 text-base font-bold">...</span>
                )}
            </button>
            <StatusDialog open={dialog} onClose={() => setDialog(false)} />
        </React.Fragment>
    );
});
