import type { IComponent, IMarkdown, Match } from "../../types";
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
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        const alt = match[3];
        const href = match[6];
        return {
            alt: alt,
            href: href,
            type: this.name,
            children: markdown.parse(alt, markdown.spans),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        return `![${markdown.serialize(node.children, "")}](${node.href})`;
    }
}
