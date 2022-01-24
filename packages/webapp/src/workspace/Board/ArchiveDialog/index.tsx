import React from "react";
import { Dialog } from "@octal/ui";
import ColumnsArchive from "./ColumnsArchive";

interface IDialog {
    board: { id: string; space_id: string };
}

export default Dialog.create<IDialog>((props) => {
    return (
        <Dialog
            maxWidth="md"
            title={"Collections Drawer"}
            open={props.open}
            fullWidth={true}
            fullHeight={true}
            onClose={props.onClose}>
            <ColumnsArchive board={props.board} />
        </Dialog>
    );
});
