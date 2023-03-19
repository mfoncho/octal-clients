import React, { useState, useId } from "react";
import * as Icons from "@colab/icons";
import { Button } from "@colab/ui";
import { usePermissions } from "../../Space";
import { FileRecord, CardFileValueRecord } from "@colab/store";
import { useCardCapability } from "../hooks";
import { useFieldAction } from "@workspace/Board/hooks";
import Field, { IField } from "./Field";

export interface IFile {
    file: FileRecord;
    onClose?: () => void;
}

const Spiner = (props: { className: string }) => (
    <svg
        className={props.className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function File(props: IFile) {
    function download() {
        window.open(props.file.download_path, "_blank");
    }

    return (
        <div className="group hover:relative flex flex-row py-1 w-fit">
            <div className="flex flex-row border-2 rounded-lg border-slate-200 items-center py-1 bg-slate-100 space-x-4">
                <div className="flex flex-row items-center space-x-1">
                    {props.file.has_preview ? (
                        <img
                            alt={props.file.name}
                            src={props.file.preview_path}
                            className="text-primary-600 w-14 h-14 rounded-md mx-1"
                        />
                    ) : (
                        <Icons.File
                            ext={props.file.ext}
                            className="text-primary-600 w-12 h-14"
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="text-sm text-gray-600 font-semibold max-w-[14rem]">
                            <p className="text-ellipsis overflow-hidden">
                                {props.file.name}.{props.file.ext}
                            </p>
                        </div>
                        <div className="font-light text-sm text-gray-500">
                            {props.file.ext?.toUpperCase()}{" "}
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

            {props.onClose && (
                <button
                    onClick={props.onClose}
                    className="absolute -top-1 -right-1.5 group-hover:visible invisible">
                    <Icons.CloseCircleSolid />
                </button>
            )}
        </div>
    );
}
export default function FileField({ field, handle, ...props }: IField) {
    const id = useId();
    const [loading, setLoading] = useState<string[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const can = useCardCapability(field.card_id);

    const actions = useFieldAction(field);

    const permissions = usePermissions();

    function handleUploadValue(e: React.ChangeEvent<HTMLInputElement>) {
        setUploading(true);
        return actions
            .createFieldValue({ value: e.target.files![0] })
            .finally(() => setUploading(false));
    }

    function handleDeleteValue(id: string) {
        let cleanUpLoading = () =>
            setLoading((loading) => loading.filter((lid) => lid !== id));
        return () => {
            if (loading.includes(id)) return;
            setLoading((loading) => loading.concat([id]));
            actions.deleteFieldValue(id).finally(cleanUpLoading);
        };
    }

    function renderFile(value: CardFileValueRecord) {
        if (can("card.manage")) {
            return (
                <File
                    key={value.id}
                    file={value.file}
                    onClose={handleDeleteValue(value.id)}
                />
            );
        }
        return <File file={value.file} key={value.id} />;
    }

    return (
        <Field handle={handle} dragging={props.dragging} field={field}>
            <div className="flex flex-col">
                {field.values.map(renderFile as any)}
                {can("card.manage") && (
                    <div className="flex flex-col p-1 w-20">
                        {!uploading &&
                            permissions.get("upload.limit", 0) > 0 && (
                                <input
                                    id={id}
                                    type="file"
                                    accept={
                                        permissions.get(
                                            "upload.types",
                                            ""
                                        ) as string
                                    }
                                    key={field.values.size.toString()}
                                    className="hidden"
                                    onChange={handleUploadValue}
                                />
                            )}
                        <label
                            role="button"
                            htmlFor={id}
                            className="group px-2 py-4 hover:bg-slate-200 rounded-xl border-2 border-slate-300 border-dashed justify-center items-center flex flex-1 bg-primary-50">
                            {uploading ? (
                                <Spiner className="animate-spin text-primary-700 w-6 h-6" />
                            ) : (
                                <Icons.Plus className="w-6 h-6 text-slate-600" />
                            )}
                        </label>
                    </div>
                )}
            </div>
        </Field>
    );
}
