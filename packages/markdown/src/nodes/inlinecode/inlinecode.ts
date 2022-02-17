import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "inline-code";

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
        return {
            type: this.name,
            children: markdown.parse(match[1], ["text"]),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return `\`${markdown.serialize(block.children, "")}\``;
    }
}
