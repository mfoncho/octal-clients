import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "paragraph";

export function match(doc: string) {
    return new RegExp(pattern).exec(doc);
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = -1;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let matched = match(doc);
        if (matched) return { index: matched.index, length: matched[0].length };
    }

    process(doc: string, _context: Context, markdown: IMarkdown) {
        return {
            type: name,
            children: markdown.parse(doc.trim(), markdown.spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return markdown.serialize(block.children, "");
    }
}
