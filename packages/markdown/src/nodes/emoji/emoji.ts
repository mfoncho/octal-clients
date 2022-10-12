import type { IComponent, IMarkdown, Match, Context } from "../../types";
import * as patterns from "@colab/patterns";

const name = "emoji";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = 0;

    get pattern() {
        return patterns.emoji;
    }

    match(doc: string) {
        let match = new RegExp(patterns.emoji).exec(doc);
        if (match) {
            return { index: match.index, length: match[0].length };
        }
    }

    process(doc: string, _context: Context, _markdown: IMarkdown) {
        return {
            type: this.name,
            emoji: doc,
        };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.emoji;
    }
}
