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

    const info = (
        <div className="flex flex-col max-w-[200px]">
            <div className="text-sm text-gray-600 font-semibold">
                <p className="text-ellipsis overflow-hidden">
                    {props.file.name}.{props.file.ext}
                </p>
            </div>
            <div className="flex flex-row font-light text-sm text-gray-500 space-x-2">
                <div>{(props.file.ext || "").toUpperCase()}</div>
                <div>{props.file.humanSize}</div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-row py-1">
            <div className="flex flex-col border-2 rounded-md border-slate-200 items-center bg-slate-50">
                {props.file.preview_url ? (
                    <div className="flex flex-col space-x-1 p-1">
                        <img
                            alt={props.file.name}
                            src={props.file.preview_url}
                            style={{
                                width: props.file.metadata.PreviewImageWidth,
                                height: props.file.metadata.PreviewImageHeight,
                            }}
                            className="text-primary-600 rounded-md"
                        />
                        {info}
                    </div>
                ) : (
                    <div className="flex flex-row items-center space-x-1 p-1">
                        <Icons.File
                            ext={props.file.ext}
                            className="text-primary-600 w-12 h-14"
                        />
                        {info}
                    </div>
                )}
                <button
                    onClick={download}
                    className="flex flex-row justify-center items-center p-2 hover:bg-slate-200 w-full rounded-b-md border-t-2 border-slate-200">
                    <Icons.Download />
                </button>
            </div>
        </div>
    );
}
