import React, { useState } from "react";
import { Dialog } from "@colab/ui";
import { ColumnRecord } from "@colab/store";
import { useColumnActions } from "@workspace/Board/hooks";

interface IDialog {
    column: ColumnRecord;
}

const warning = (column: ColumnRecord) => `
All cards in __${column.name}__ will be hidden untill the column is unstashed
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
            title="Stach Column"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            {warning(column)}
        </Dialog.Warning>
    );
});
