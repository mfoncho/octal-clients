import React, { useState } from "react";
import { Dialog } from "@octal/ui";
import { ColumnRecord } from "@octal/store";
import { useColumnActions } from "@workspace/Board/hooks";

interface IDialog {
    column: ColumnRecord;
}

const warning = `
Stashed columns have call their cards
hidden untill the column is unstashed
`;

export default Dialog.create<IDialog>(({ column, ...props }) => {
    const [loading, setLoading] = useState(false);

    const actions = useColumnActions(column);

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.stash().catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Dialog.Warning
            open={props.open}
            title={`Stach (${column.name})`}
            confirm="Confirm"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            {warning}
        </Dialog.Warning>
    );
});
