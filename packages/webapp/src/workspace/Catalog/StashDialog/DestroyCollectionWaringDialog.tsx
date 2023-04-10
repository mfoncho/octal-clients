import React, { useState } from "react";
import { Dialog, Markdown } from "@colab/ui";
import { useCollectionActions } from "@workspace/Catalog/hooks";
import { CollectionRecord } from "@colab/store";

interface IDialog {
    collection: CollectionRecord;
}

export default Dialog.create<IDialog>(({ collection, ...props }) => {
    const [loading, setLoading] = useState(false);

    const actions = useCollectionActions(collection);

    function handleConfirm(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        actions.destroy().catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Collection"
            onClose={loading ? undefined : props.onClose}
            disabled={loading}
            onConfirm={handleConfirm}>
            <Markdown>
                {`All data related to __${collection.name}__ will be lost permently.`}
            </Markdown>
        </Dialog.Warning>
    );
});
