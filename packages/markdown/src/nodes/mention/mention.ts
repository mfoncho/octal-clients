import type { IComponent, IMarkdown, Match } from "../../types";
import * as patterns from "@octal/patterns";

const name = "mention";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = 0;

    get pattern() {
        return patterns.mention;
    }

    match(doc: string) {
        return new RegExp(patterns.mention).exec(doc);
    }

    process(match: Match, _markdown: IMarkdown) {
        const prefix = match[0][0];
        return {
            type: this.name,
            value: match[1],
            mention: match[0],
            prefix: prefix,
        };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.mention;
    }
}
