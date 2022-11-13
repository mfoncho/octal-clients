import React from "react";
import { Dialog, Text } from "@colab/ui";
import { CardFieldRecord } from "@colab/store";

interface IDialog {
    field: CardFieldRecord;
    onConfirm: (e: React.MouseEvent) => void;
}

export default Dialog.create<IDialog>(({ field, ...props }) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Field"
            confirm="Delete"
            onClose={props.onClose}
            onConfirm={props.onConfirm}>
            <div className="flex flex-col">
                <div className="pb-2">
                    <span className="text-lg font-bold">
                        <Text>{field.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-500">
                        All field values will be lost permanently
                    </span>
                </div>
            </div>
        </Dialog.Warning>
    );
});
