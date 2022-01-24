import React from "react";
import { Dialog, Markdown } from "@octal/ui";
import { CardRecord } from "@octal/store";

interface IDialog {
    card: CardRecord;
    onConfirm: (e: React.MouseEvent) => void;
}

function warning(name: string) {
    return `
__${name}__

All data related to this card will be lost
permanently. 
    `;
}

export default Dialog.create<IDialog>(({ card, ...props }) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Card"
            confirm="Delete"
            onClose={props.onClose}
            onConfirm={props.onConfirm}>
            <Markdown>{warning(card.name)}</Markdown>
        </Dialog.Warning>
    );
});
