import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "link";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        const doc = match[1];
        const href = match[4];
        return {
            type: this.name,
            href: href,
            children: markdown.parse(doc, match.types),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        return `[${markdown.serialize(node.children, "")}](${node.href})`;
    }
}
