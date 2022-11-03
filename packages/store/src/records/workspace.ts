import { Record } from "immutable";
export type WorkspaceRecord = Map<string, any>;

export type FileMetadata = {
    PreviewImageWidth?: number;
    PreviewImageHeight?: number;
    MIMEType?: string;
    [key: string]: any;
};

export class FileRecord extends Record({
    id: "",
    ext: "",
    name: "",
    size: 0,
    filename: "",
    metadata: {} as FileMetadata,
    bucket_id: "",
}) {
    get has_preview() {
        const { PreviewImageWidth, PreviewImageHeight } = this.metadata;
        return Boolean(PreviewImageWidth) && Boolean(PreviewImageHeight);
    }

    get preview_path() {
        return `/bucket/${this.bucket_id}/${this.id}/preview.png`;
    }

    get download_path() {
        return `/bucket/${this.bucket_id}/${this.id}/file.${this.ext}?download=true&filename=${this.filename}`;
    }

    get humanSize() {
        let decimals = 2;
        if (this.size === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(this.size) / Math.log(k));

        return (
            parseFloat((this.size / Math.pow(k, i)).toFixed(dm)) +
            " " +
            sizes[i]
        );
    }
}
