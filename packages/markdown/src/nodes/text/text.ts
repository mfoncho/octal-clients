import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "text";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = -1;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let match = new RegExp(pattern).exec(doc);
        if (match) return { index: match.index, length: match[0].length };
    }

    process(doc: string, _context: Context, _markdown: IMarkdown) {
        return { type: name, value: doc };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.value;
    }
}
