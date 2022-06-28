import { Record } from "immutable";
export type WorkspaceRecord = Map<string, any>;

export class FileRecord extends Record({
    id: "",
    ext: "",
    name: "",
    size: 0,
    preview: "",
    filename: "",
    bucket_id: "",
}) {}
