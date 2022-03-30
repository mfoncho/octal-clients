import {
    Editor,
    Range,
    Element as SlateElement,
    Point,
    Transforms,
} from "slate";
import { Slater } from "@octal/markdown";

import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type TextNode = { text: string };

type Paragraph = { type: "paragraph"; children: TextNode[] };

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: Paragraph;
        Text: TextNode;
    }
    type SlateElement = {
        type: string;
        children: TextNode[];
    };
}

const MENTION_TYPE = "mention";

const LINK_TYPE = "link";

const EMOJI_TYPE = "emoji";

const SHORTCUTS = {
    "*": "list-item",
    "-": "list-item",
    "+": "list-item",
    ">": "blockquote",
    "#": "heading",
    "##": "heading",
    "###": "heading",
    "####": "heading",
    "#####": "heading",
    "######": "heading",
};

type TWrapper = (editor: Editor) => Editor;

export const wrap = (editor: Editor, plugins: TWrapper[]): Editor => {
    return plugins.reduce((editor, plug) => plug(editor), editor);
};

export const withPaste = (slater: Slater) => {
    return (editor: any) => {
        const { insertData, isInline, isVoid } = editor;

        editor.isInline = (element: any) => {
            return element.type === EMOJI_TYPE ? true : isInline(element);
        };

        editor.isVoid = (element: any) => {
            return element.type === EMOJI_TYPE ? true : isVoid(element);
        };

        editor.insertData = (data: any) => {
            const text = data.getData("text/plain");
            if (Boolean(text)) {
                let parsed = slater.parse(text);
                if (parsed.length > 0) {
                    if (Boolean(parsed[parsed.length - 1].emoji))
                        parsed.push({ text: "" });
                    return Transforms.insertNodes(editor, parsed);
                }
            }
            return insertData(data);
        };

        return editor;
    };
};

export const withMention = (editor: Editor) => {
    const { isInline, isVoid } = editor;

    editor.isInline = (element: any) => {
        return MENTION_TYPE == element.type ? true : isInline(element);
    };

    editor.isVoid = (element: any) => {
        return MENTION_TYPE == element.type ? true : isVoid(element);
    };

    return editor;
};

export const withLink = (editor: Editor) => {
    const { isInline, isVoid } = editor;

    editor.isInline = (element: any) => {
        return LINK_TYPE == element.type ? true : isInline(element);
    };

    editor.isVoid = (element: any) => {
        return LINK_TYPE == element.type ? false : isVoid(element);
    };

    return editor;
};

export const withTables = (editor: Editor) => {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = (unit: any) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);

                if (Point.equals(selection.anchor, start)) {
                    return;
                }
            }
        }

        deleteBackward(unit);
    };

    editor.deleteForward = (unit: any) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const end = Editor.end(editor, cellPath);

                if (Point.equals(selection.anchor, end)) {
                    return;
                }
            }
        }

        deleteForward(unit);
    };

    editor.insertBreak = () => {
        const { selection } = editor;

        if (selection) {
            let [match] = Editor.nodes(editor, {
                at: selection,
                match: (n: any) =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type == "table",
            });

            if (match && match.length > 1) {
                let [, path] = match;
                const paragraph = [
                    {
                        type: "paragraph",
                        children: [{ text: "" }],
                    },
                ];
                path = Array.from(path);
                path[path.length - 1] = path[path.length - 1] + 1;
                Transforms.insertNodes(editor, paragraph as any, {
                    at: path,
                });
                return Transforms.move(editor, {
                    unit: "line",
                    reverse: false,
                    distance: 1,
                });
            }
        }

        insertBreak();
    };
    return editor;
};

export const withShortcuts = (editor: Editor) => {
    const { deleteBackward, insertText } = editor;

    editor.insertText = (text: any) => {
        const { selection } = editor;

        if (text === " " && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const block = Editor.above(editor, {
                match: (n) => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = { anchor, focus: start };
            const beforeText = Editor.string(editor, range);
            const type = SHORTCUTS[beforeText as keyof typeof SHORTCUTS];

            if (type) {
                Transforms.select(editor, range);
                Transforms.delete(editor);
                const newProperties: any = {
                    type,
                };
                switch (beforeText.trim()) {
                    case "+":
                        newProperties.ordered = true;
                        newProperties.spread = false;
                        newProperties.checked = null;
                        break;

                    case "*":
                    case "-":
                        newProperties.ordered = false;
                        newProperties.spread = false;
                        newProperties.checked = null;
                        break;

                    case "#":
                    case "##":
                    case "###":
                    case "####":
                    case "#####":
                    case "######":
                        newProperties.depth = beforeText
                            .trim()
                            .split("").length;
                        break;

                    default:
                        break;
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: (n) => Editor.isBlock(editor, n),
                });

                if (type === "list-item") {
                    const list: any = {
                        type: "list",
                        checked: newProperties.checked,
                        ordered: newProperties.ordered,
                        children: [],
                    };
                    Transforms.wrapNodes(editor, list, {
                        match: (n) =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            (n as any).type === "list-item",
                    });
                }

                return;
            }
        }

        insertText(text);
    };

    editor.deleteBackward = (...args: any) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: (n) => Editor.isBlock(editor, n),
            });

            if (match) {
                const [block, path] = match as [any, any];
                const start = Editor.start(editor, path);

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== "paragraph" &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: "paragraph",
                    };
                    Transforms.setNodes(editor, newProperties);

                    if (block.type === "list-item") {
                        Transforms.unwrapNodes(editor, {
                            match: (n) =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                (n as any).type === "list",
                            split: true,
                        });
                    }

                    return;
                }
            }

            //@ts-ignore
            deleteBackward(...args);
        }
    };

    return editor;
};
