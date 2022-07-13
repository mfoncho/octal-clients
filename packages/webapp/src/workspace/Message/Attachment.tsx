import React from "react";
import * as Icons from "@octal/icons";
import { Button } from "@octal/ui";
import { FileRecord } from "@octal/store";

export interface IAttachment {
    file: FileRecord;
}

export default function Attachment(props: IAttachment) {
    function download() {
        window.open(props.file.download_url, "_blank");
    }

    return (
        <div className="flex flex-row py-1">
            <div className="flex flex-row border-2 rounded-md border-slate-200 items-center py-1 bg-slate-100 space-x-4">
                <div className="flex flex-row items-center space-x-1">
                    {props.file.preview_url ? (
                        <img
                            alt={props.file.name}
                            src={props.file.preview_url}
                            className="text-primary-600 w-14 h-14 rounded-md mx-1"
                        />
                    ) : (
                        <Icons.File
                            ext={props.file.ext}
                            className="text-primary-600 w-12 h-14"
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-600 font-semibold">
                            <p className="text-ellipsis overflow-hidden">
                                {props.file.name}.{props.file.ext}
                            </p>
                        </div>
                        <div className="font-light text-sm text-gray-500">
                            {props.file.ext.toUpperCase()}{" "}
                            {props.file.humanSize}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-2">
                    <Button onClick={download} variant="icon" color="clear">
                        <Icons.Download />
                    </Button>
                </div>
            </div>
        </div>
    );
}
