import type { IComponent, IMarkdown, Context } from "../../types";
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
        let match = new RegExp(patterns.mention).exec(doc);
        if (match) return { index: match.index, length: match[0].length };
    }

    process(doc: string, _context: Context, _markdown: IMarkdown) {
        return {
            type: this.name,
            value: doc,
        };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.value;
    }
}
