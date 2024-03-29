import React from "react";
import Dialog from "../Dialog";
import Button from "../Button";
import * as Icons from "@colab/icons";
import UIEvent from "../event";
import { fileinfo } from "./utils";

interface IDialog {
    files: File[];
    onChange: (event: UIEvent<{ value: File[] }>) => void;
}

export default Dialog.create<IDialog>(({ files, ...props }) => {
    function removeFile(index: number) {
        return (event: React.MouseEvent) => {
            let value = files.filter((_v, i) => i !== index);
            props.onChange(UIEvent.create({ value }, event));
        };
    }

    function renderFile(file: File, index: number) {
        const key = String(index);
        const info = fileinfo(file);
        return (
            <div
                key={key}
                className="flex flex-row items-center px-3 py-2 justify-between rounded-md bg-gray-50 my-1 border-2 border-gray-200 overflow-hidden">
                <div className="w-8 h-8 text-xl">
                    <Icons.File
                        ext={info.ext}
                        className="w-8 h-8 text-primary-500"
                    />
                </div>
                <div className="flex flex-col ml-2 pr-8 flex-1 overflow-hidden">
                    <span className="font-semibold">
                        <p className="truncate overflow-hidden">{info.name}</p>
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                        {info.type}
                    </span>
                </div>
                <div className="pl-8">
                    <Button onClick={removeFile(index)} variant="icon">
                        <Icons.Delete />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Dialog
            title="Upload Queue"
            maxWidth="xs"
            open={props.open && files.length > 0}
            fullWidth={true}
            onClose={props.onClose}>
            <Dialog.Content className="flex flex-col pb-8">
                {files.map(renderFile)}
            </Dialog.Content>
        </Dialog>
    );
});
