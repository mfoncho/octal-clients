import React from "react";
import { Dialog, Text } from "@colab/ui";
import { CardRecord } from "@colab/store";

interface IDialog {
    card: CardRecord;
    onConfirm: (e: React.MouseEvent) => void;
}

export default Dialog.create<IDialog>(({ card, ...props }) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Card"
            confirm="Delete"
            onClose={props.onClose}
            onConfirm={props.onConfirm}>
            <div className="flex flex-col">
                <div className="pb-8">
                    <span className="text-lg font-bold">
                        <Text>{card.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-500">
                        All data related to this card will be lost permanently.
                    </span>
                </div>
            </div>
        </Dialog.Warning>
    );
});
