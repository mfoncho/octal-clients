import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "inlinecode";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

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

    process(doc: string, _context: Context, markdown: IMarkdown) {
        let match = new RegExp(pattern).exec(doc)!;
        return {
            type: this.name,
            children: markdown.parse(match[1], ["text"]),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return `\`${markdown.serialize(block.children, "")}\``;
    }
}
