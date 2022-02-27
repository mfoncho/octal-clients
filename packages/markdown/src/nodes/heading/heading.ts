import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "heading";

export function parse(match: RegExpExecArray): [number, string] {
    if (match[5] && match[6]) {
        return [match[5].length, match[6]];
    } else {
        return [match[13] === "=" ? 1 : 2, match[8]];
    }
}

export function match(doc: string) {
    return new RegExp(pattern).exec(doc);
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let matched = match(doc);
        if (matched) {
            return { index: matched.index, length: matched[0].length };
        }
    }

    process(doc: string, _context: Context, markdown: IMarkdown) {
        const [depth, title] = parse(match(doc)!);
        return {
            type: name,
            depth: depth,
            children: markdown.parse(title, markdown.spans),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        let marker = "";

        for (let i = 0; i < node.depth; i++) {
            marker = `#${marker}`;
        }

        return `${marker} ${markdown.serialize(node.children, "")}`;
    }
}
