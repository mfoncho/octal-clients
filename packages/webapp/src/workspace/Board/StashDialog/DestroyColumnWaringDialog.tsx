import React, { useState } from "react";
import { Dialog, Markdown } from "@octal/ui";
import { useColumnActions } from "@workspace/Board/hooks";
import { ColumnRecord } from "@octal/store";

interface IDialog {
    column: ColumnRecord;
}

export default Dialog.create<IDialog>(({ column, ...props }) => {
    const [loading, setLoading] = useState(false);

    const actions = useColumnActions(column);

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.destroy().catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Column"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            <Markdown>
                {`All data related to __${column.name}__ will be lost permently.`}
            </Markdown>
        </Dialog.Warning>
    );
});
