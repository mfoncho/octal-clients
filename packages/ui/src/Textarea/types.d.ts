import UIEvent from "../event";
import { createEditor, Descendant } from "slate";

export interface InputFile {
    preview?: string;
    ext: string;
    file: File;
    name: string;
    type: string;
}

export interface EventTarget {
    data: Descendant[];
    value: string;
    editor: ReturnType<typeof createEditor>;
    files: InputFile[];
}
