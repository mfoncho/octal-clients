import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "bold";

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
        const doc = match[2] ?? match[5];
        const spans = match.types.filter((name) => name !== this.name);
        return {
            type: this.name,
            children: markdown.parse(doc, spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return `**${markdown.serialize(block.children, "")}**`;
    }
}
