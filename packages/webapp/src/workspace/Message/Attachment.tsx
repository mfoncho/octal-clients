import React from "react";
import { Button, Image } from "@colab/ui";
import * as Icons from "@colab/icons";
import { FileRecord } from "@colab/store";

export interface IAttachment {
    file: FileRecord;
}

export default function Attachment({ file }: IAttachment) {
    function download() {
        window.open(file.download_url, "_blank");
    }

    const [pwidth, pheight] = file.previewSize(120);

    return (
        <div className="flex flex-row py-1">
            <div className="flex flex-row border-2 rounded-lg border-slate-200 items-center py-1 bg-slate-100 space-x-4">
                <div className="flex flex-row items-center space-x-1">
                    {file.previewable ? (
                        <Image
                            src={file.preview(120)!}
                            alt={file.filename}
                            style={{ height: pheight, width: pwidth }}
                            className="text-primary-600 rounded-md mx-1"
                        />
                    ) : (
                        <Icons.File
                            ext={file.ext}
                            className="text-primary-600 w-12 h-14"
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-600 font-semibold max-w-[14rem]">
                            <p className="text-ellipsis overflow-hidden">
                                {file.filename}
                            </p>
                        </div>
                        <div className="font-light text-sm text-gray-500">
                            {file.ext?.toUpperCase()} {file.humanSize}
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
