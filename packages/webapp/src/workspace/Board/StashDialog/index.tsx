import React from "react";
import { Dialog } from "@octal/ui";
import ColumnsStash from "./ColumnsStash";

interface IDialog {
    board: { id: string; space_id: string };
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
            <ColumnsStash board={props.board} />
        </Dialog>
    );
});
