import { Record } from "immutable";
export type WorkspaceRecord = Map<string, any>;

export type FileMetadata = {
    width?: number;
    height?: number;
    duration?: number;
    MIMEType?: string;
    [key: string]: any;
};

export class FileRecord extends Record({
    id: "",
    ext: "",
    name: "",
    size: 0,
    url: "",
    filename: "",
    metadata: {} as FileMetadata,
    bucket_id: "",
}) {

    get previewable(){
        let { height, width, duration} = this.metadata;
        if(duration !== 0 && width && height){
            return true
        }
        return false;
    }

    preview(size=100) {
        let { height, width} = this.metadata;
        if(width && height){
            const [pwidth, pheight] = FileRecord.scale(width, height, size)
            if(width <= pwidth && height <= pheight) {
                return `${this.url}?frame=0`;
            } else {
                return `${this.url}?width=${pwidth}&height=${pheight}&frame=0`;
            }
        }
        return null
    }

    get download_url() {
        return `${this.url}?download=true&filename=${this.filename}`;
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

    static scale(width: number, height: number, max: number){
        var ratio = Math.min(max / width, max / height);
        return [Math.floor(width*ratio), Math.floor(height*ratio)];
    }
}
