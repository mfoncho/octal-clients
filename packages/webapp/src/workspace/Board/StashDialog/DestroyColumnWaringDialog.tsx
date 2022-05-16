import React, { useState } from "react";
import { Dialog } from "@octal/ui";
import { useColumnActions } from "@workspace/Board/hooks";
import { ColumnRecord } from "@octal/store";

interface IDialog {
    column: ColumnRecord;
}

const warning = `
All date related to this column and cards in this 
column will be lost permently. This action cannot 
be undone!.
`;

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
            title={`Delete Column (${column.name})`}
            confirm="Delete"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            {warning}
        </Dialog.Warning>
    );
});
