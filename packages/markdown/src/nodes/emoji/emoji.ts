import type { IComponent, IMarkdown, Match } from "../../types";
import * as patterns from "@octal/patterns";

const name = "emoji";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = 0;

    get pattern() {
        return patterns.emoji;
    }

    match(doc: string) {
        return new RegExp(patterns.emoji).exec(doc);
    }

    process(match: Match, _markdown: IMarkdown) {
        return {
            type: this.name,
            emoji: match[0],
        };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.emoji;
    }
}
