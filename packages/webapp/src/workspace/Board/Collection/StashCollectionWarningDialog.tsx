import React, { useState } from "react";
import { Dialog } from "@colab/ui";
import { CollectionRecord } from "@colab/store";
import { useCollectionActions } from "@workspace/Board/hooks";

interface IDialog {
    collection: CollectionRecord;
}

const warning = (collection: CollectionRecord) => `
All cards in __${collection.name}__ will be hidden untill the collection is unstashed
`;

export default Dialog.create<IDialog>(({ collection, ...props }) => {
    const [loading, setLoading] = useState(false);

    const actions = useCollectionActions(collection);

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.stash().catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Dialog.Warning
            open={props.open}
            title="Stach Collection"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            {warning(collection)}
        </Dialog.Warning>
    );
});
