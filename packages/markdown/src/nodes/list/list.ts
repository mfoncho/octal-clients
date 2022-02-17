import type { IComponent, IMarkdown, Match } from "../../types";
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

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        const [ordered, items] = parse(match[1] ?? match[4] ?? match[0]);
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
