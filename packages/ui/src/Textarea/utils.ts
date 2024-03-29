import {
    Transforms,
    Text,
    Element as SlateElement,
    Editor,
    Range,
} from "slate";
import * as patterns from "@colab/patterns";
import emoji from "@colab/emoji";

const LIST_TYPES = ["list"];

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
    const isBlockquote = format == "blockquote";

    if (isBlockquote) {
        let nearestBlockParent = Editor.above(editor, {
            match: (n) => SlateElement.isElement(n),
        })!;
        if (!Boolean(nearestBlockParent)) {
            // User selected multiple things
            return;
        }
        if (isActive) {
            let [, path] = Editor.above(editor, {
                match: (n) =>
                    //@ts-ignore
                    SlateElement.isElement(n) && n.type == "blockquote",
            })!;
            Transforms.unwrapNodes(editor, {
                at: path,
                split: true,
            });
        } else {
            let [block] = nearestBlockParent;
            //@ts-ignore
            if (block.type == "paragraph") {
                const block = { type: format, children: [] };
                Transforms.wrapNodes(editor, block as any);
            } else {
                const blockquote = { type: format, children: [] };
                const paragraph = { type: "paragraph" };
                Transforms.setNodes(editor, paragraph as any);
                Transforms.wrapNodes(editor, blockquote as any);
            }
        }
    } else {
        const newProperties: any = {
            type: isActive ? "paragraph" : isList ? "list-item" : format,
        };

        if (format === "heading") {
            newProperties.depth = 5;
        }

        Transforms.unwrapNodes(editor, {
            match: (n) =>
                LIST_TYPES.includes(
                    !Editor.isEditor(n) && SlateElement.isElement(n)
                        ? n.type
                        : ""
                ),
            split: true,
        });

        Transforms.setNodes(editor, newProperties as any);
        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block as any);
        }
    }
};

export function clearEditor(editor: Editor) {
    // get path of first and last element in editor
    Transforms.delete(editor, {
        at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
        },
    });

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

export function isActiveElement(editor: any, type: string) {
    const [nodes] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type,
    });
    return !!nodes;
}

export function unwrapElement(editor: any, type: string) {
    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type,
    });
}

export function isFormatActive(editor: any, format: string) {
    const [match] = Editor.nodes(editor, {
        match: (n: any) => n[format] === true,
        mode: "all",
    });
    return !!match;
}

export function insertEmoji(editor: Editor, value: any) {
    if (isActiveElement(editor, "emoji")) {
        unwrapElement(editor, "emoji");
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    const node = {
        src: emoji.image(value),
        type: "emoji",
        emoji: value,
        children: [{ text: "" }],
    };
    if (isCollapsed) {
        Transforms.insertNodes(editor, node as any);
    } else {
        Transforms.wrapNodes(editor, node as any, { split: true });
        Transforms.collapse(editor, { edge: "end" });
    }

    Transforms.move(editor);
}

export function insertMention(editor: Editor, value: string) {
    let match = new RegExp(patterns.mention).exec(value)!;
    const mentioned = {
        value: value,
        type: "mention",
        name: match[1],
        entity: match[2],
        children: [{ text: "" }],
    };
    const nodes = [mentioned, { text: " " }];
    Transforms.insertNodes(editor, nodes as any);
    Transforms.move(editor);
}

export function fileinfo(file: File) {
    const ext = file.name.split(".").pop() ?? "";
    const name = file.name.split(".").slice(0, -1).join(".");
    const type = file.type;
    return { ext, name, type, file };
}
