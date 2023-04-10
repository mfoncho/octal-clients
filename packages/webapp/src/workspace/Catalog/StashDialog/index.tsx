import React from "react";
import { Dialog } from "@colab/ui";
import CollectionsStash from "./CollectionsStash";

interface IDialog {
    catalog: { id: string; space_id: string };
}

export default Dialog.create<IDialog>((props) => {
    return (
        <Dialog
            title="Stash"
            maxWidth="md"
            open={props.open}
            fullWidth={true}
            fullHeight={true}
            onClose={props.onClose}>
            <CollectionsStash catalog={props.catalog} />
        </Dialog>
    );
});
