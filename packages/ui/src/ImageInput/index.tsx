import React, { useState, useEffect, useCallback } from "react";
import Dialog from "../Dialog";
import Button from "../Button";
import { cropImage } from "./utils";
import Cropper from "react-easy-crop";

const accept = "image/png, image/jpeg, image/jpg, image/gif";

let mountid = 0;

export interface ICrop {
    x: number;
    y: number;
}

export interface IPartialProps {
    value: string | undefined | null;
    alt?: string;
    view?: "round" | "rect";
    aspect?: number;
    disabled?: boolean;
    placeholder?: string | React.ReactNode;
    accept?: string;
    size?: { width: number; height: number };
    onChange: (e: string) => any;
}

export type IImageInput = Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    keyof IPartialProps
> &
    IPartialProps;

export interface IIEditor {
    file: File;
    view?: "round" | "rect";
    size?: { width: number; height: number };
    onSubmit?: (value: Blob) => void;
}

export interface ICroppedArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

const defaultSize = { width: 800, height: 800 };

export const Editor = Dialog.create<IIEditor>(
    ({ view = "rect", size = defaultSize, ...props }) => {
        const [ready, setReady] = useState(false);
        const [cropping, setCropping] = useState(false);
        const [src, setSrc] = useState<string>();
        const [crop, setCrop] = useState({ x: 0, y: 0 });
        const [zoom, setZoom] = useState(1);
        const [croppedArea, setCroppedArea] = useState<ICroppedArea>();

        const [classes] = useState({
            containerClassName: "w-full h-full",
            mediaClassName: "min-h-full",
        });

        useEffect(() => {
            const timeout = setTimeout(() => setReady(true), 500);

            return () => {
                clearTimeout(timeout);
            };
        }, []);

        useEffect(() => {
            if (props.file) {
                const url = URL.createObjectURL(props.file);
                setSrc(url);
                return () => {
                    URL.revokeObjectURL(url);
                };
            }
        }, [props.file]);

        const onCropComplete = useCallback(
            (_croppedArea: any, croppedAreaPixels: any) => {
                if (!cropping) setCroppedArea(croppedAreaPixels);
            },
            []
        );

        function applyCropped() {
            if (croppedArea && src && !cropping) {
                setCropping(true);
                cropImage(src, croppedArea, size).then((blob) => {
                    if (props.onSubmit) {
                        props.onSubmit(blob);
                    }
                    setCropping(false);
                });
            }
        }

        return (
            <Dialog
                title="Edit Image"
                open={props.open}
                onClose={props.onClose}>
                <div className="relative flex justify-center items-center overflow-hidden w-full h-96 bg-black flex flex-row">
                    {ready && props.open ? (
                        <Cropper
                            image={src}
                            crop={crop}
                            classes={classes}
                            zoom={zoom}
                            showGrid={false}
                            aspect={size.width / size.height}
                            cropShape={view}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    ) : (
                        <img
                            src={src}
                            alt="preview"
                            className="h-full max-h-full object-contain"
                        />
                    )}
                </div>
                <Dialog.Actions className="rounded-b-lg">
                    <Button
                        disabled={
                            cropping &&
                            !ready &&
                            !Boolean(croppedArea) &&
                            !Boolean(src)
                        }
                        color="primary"
                        onClick={applyCropped}>
                        Apply
                    </Button>
                </Dialog.Actions>
            </Dialog>
        );
    }
);

export default function ImageInput(props: IImageInput) {
    const [file, setFile] = useState<File | undefined | null>();

    const [id] = useState<string>(props.id ?? `image-input-${mountid}`);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0];
        if (file) {
            setFile(file);
        }
    }

    // Update mountid to prevent id collision
    // when component is used in multiple
    // places
    useEffect(() => {
        mountid++;
    }, []);

    function renderPlaceholder() {
        if (props.value) {
            return (
                <img
                    alt={props.alt}
                    src={props.value}
                    className={props.className}
                />
            );
        }
        const placeholderType = typeof props.placeholder;
        if (placeholderType == "string") {
            return (
                <img
                    src={props.placeholder as any}
                    alt={props.alt}
                    className={props.className}
                />
            );
        }

        // Cast placeholder to boolean because null is an object
        // but null cast to boolean is false
        if (placeholderType == "object" && Boolean(props.placeholder)) {
            return props.placeholder;
        }
    }

    function handleCloseEditor() {
        setFile(null);
    }

    function handleSubmit(image: Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
            props.onChange(reader.result as string);
        };
        handleCloseEditor();
    }

    return (
        <div>
            <input
                id={id}
                type="file"
                disabled={props.disabled}
                accept={props.accept ? props.accept : accept}
                className="absolute invisible"
                onChange={handleInputChange}
            />
            <label htmlFor={id}>{renderPlaceholder()}</label>
            <Editor
                file={file!}
                size={props.size ?? defaultSize}
                open={Boolean(file)}
                onSubmit={handleSubmit}
                onClose={handleCloseEditor}
            />
        </div>
    );
}
