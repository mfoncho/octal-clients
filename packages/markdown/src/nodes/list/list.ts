import type { IComponent, IMarkdown, Context } from "../../types";
import pattern, { task } from "./pattern";

const name = "list";

const preunordered = ["-", "*", "+"];

const retask = new RegExp(task);

export type ListItem = {
    checklist: Boolean;
    index: number;
    checked?: Boolean;
    text: string;
};

function parseline(line: string, index: number): ListItem {
    let text = line.split("").slice(2).join("").trim();
    const match = retask.exec(text);
    let checked: Boolean | undefined = undefined;
    if (match) {
        text = match[2];
        checked = Boolean(match[1].trim());
    }
    return { checklist: Boolean(match), index, checked, text };
}

export function parse(doc: string): [boolean, ListItem[]] {
    const ordered = preunordered.includes(doc[0]) ? false : true;
    let items: ListItem[] = [];
    if (ordered) {
        items = doc.trim().split("\n").map(parseline);
    } else {
        items = doc.trim().split("\n").map(parseline);
    }
    return [ordered, items];
}

export function match(doc: string) {
    return new RegExp(pattern).exec(doc);
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let matched = match(doc);
        if (matched) return { index: matched.index, length: matched[0].length };
    }

    process(doc: string, _context: Context, markdown: IMarkdown) {
        let matched = match(doc)!;
        const [ordered, items] = parse(matched[1] ?? matched[4] ?? matched[0]);
        return {
            type: name,
            ordered: ordered,
            children: items.map((item) => {
                return {
                    type: "list-item",
                    index: item.index,
                    checked: item.checked,
                    checklist: item.checklist,
                    children: markdown.parse(item.text, markdown.spans),
                };
            }),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        return node.children
            .map((item: any, index: number) => {
                let pre = node.ordered ? `${index + 1})` : "-";
                if (item.checklist) {
                    pre = item.checked ? `${pre} [x]` : `${pre} [ ]`;
                }
                return `${pre} ${markdown.serialize(item.children, "")}`.trim();
            })
            .join("\n");
    }
}
