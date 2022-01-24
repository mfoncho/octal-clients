import React, { useState } from "react";
import { Dialog } from "@octal/ui";
import { ColumnRecord } from "@octal/store";
import { useColumnActions } from "@workspace/Board/hooks";

interface IDialog {
    column: ColumnRecord;
}

const warning = `
Archiving this column means All cards in the column will be
hidden untill the column is unarchived
`;

export default Dialog.create<IDialog>(({ column, ...props }) => {
    const [loading, setLoading] = useState(false);

    const actions = useColumnActions(column);

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.archive().catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Dialog.Warning
            open={props.open}
            title={`Archive Column (${column.name})`}
            confirm="Archive"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            {warning}
        </Dialog.Warning>
    );
});
