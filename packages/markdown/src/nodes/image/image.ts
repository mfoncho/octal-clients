import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "image";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let match = new RegExp(pattern).exec(doc);
        if (match) {
            return { index: match.index, length: match[0].length };
        }
    }

    process(doc: string, context: Context, markdown: IMarkdown) {
        let match = new RegExp(pattern).exec(doc)!;
        const alt = match[3];
        const url = match[6];
        return {
            alt: alt,
            url: url,
            type: this.name,
            children: markdown.parse(alt, markdown.spans),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        const text = markdown.serialize(node.children, "").trim();
        return `![${text}](${node.url})`;
    }
}
