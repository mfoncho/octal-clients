import { Transforms, Text, Element as SlateElement, Editor } from "slate";
import emoji from "@octal/emoji";
import { IFileItem } from "./types";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

export const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor) as any;
    return marks ? marks[format] === true : false;
};

export const isEmojiActive = (editor: Editor) => {
    const leaf = Editor.marks(editor) as any;
    if (leaf && leaf.emoji) {
        return true;
    }
    return false;
};

export const getBlock = (editor: Editor) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => {
            return !Editor.isEditor(n) && SlateElement.isElement(n);
        },
    }) as any;
    return match;
};

export const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => {
            return (
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === format
            );
        },
    }) as any;
    return !!match;
};

export const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            LIST_TYPES.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) ? n.type : ""
            ),
        split: true,
    });

    const newProperties = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    };

    Transforms.setNodes(editor, newProperties as any);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block as any);
    }
};

export function clearEditor(editor: Editor) {
    // get path of first and last element in editor
    const [, first_element_path] = Editor.first(editor, [0]);
    const [, last_element_path] = Editor.last(editor, [
        editor.children.length - 1,
    ]);

    // create full range from first -> last element
    const full_range = Editor.range(
        editor,
        first_element_path,
        last_element_path
    );

    // remove all nodes starting from the highest one
    Transforms.removeNodes(editor, {
        at: full_range,
        mode: "highest",
        hanging: true,
    });

    // insert an empty paragraph
    if (editor.children.length === 0) {
        Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
        });
    }

    return;
}

export function toggleFormat(editor: any, format: string) {
    const isActive = isFormatActive(editor, format);
    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    );
}

export function isFormatActive(editor: any, format: string) {
    const [match] = Editor.nodes(editor, {
        match: (n: any) => n[format] === true,
        mode: "all",
    });
    return !!match;
}

export function insertEmoji(editor: Editor, value: any) {
    const node = {
        src: emoji.image(value),
        type: "emoji",
        emoji: value,
        children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, [node, { text: "" }] as any);
    Transforms.move(editor);
}

export function insertMention(editor: Editor, value: string) {
    const mentioned = {
        value: value,
        type: "mention",
        children: [{ text: "" }],
    };
    const nodes = [mentioned, { text: " " }];
    Transforms.insertNodes(editor, nodes as any);
    Transforms.move(editor);
}

export function fileItem(file: File): IFileItem {
    const ext = file.name.split(".").pop() ?? "";
    const name = file.name.split(".").slice(0, -1).join(".");
    const type = file.type;
    return { ext, name, type, file };
}
