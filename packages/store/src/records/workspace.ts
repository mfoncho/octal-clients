import { Record } from "immutable";
export type WorkspaceRecord = Map<string, any>;

export class FileRecord extends Record({
    id: "",
    ext: "",
    name: "",
    size: 0,
    filename: "",
    bucket_id: "",
    preview_url: "",
    download_url: "",
}) {
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
