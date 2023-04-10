import React from "react";
import { Dialog, Text } from "@colab/ui";
import { RecordRecord } from "@colab/store";

interface IDialog {
    record: RecordRecord;
    onConfirm: (e: React.MouseEvent) => void;
}

export default Dialog.create<IDialog>(({ record, ...props }) => {
    return (
        <Dialog.Warning
            open={props.open}
            title="Delete Record"
            confirm="Delete"
            onClose={props.onClose}
            onConfirm={props.onConfirm}>
            <div className="flex flex-col">
                <div className="pb-8">
                    <span className="text-lg font-bold">
                        <Text>{record.name}</Text>
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-500">
                        All data related to this record will be lost
                        permanently.
                    </span>
                </div>
            </div>
        </Dialog.Warning>
    );
});
