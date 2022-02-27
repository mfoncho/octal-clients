import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "code";

export function parse(doc: string): [string, string] {
    let match = new RegExp(pattern).exec(doc)!;
    return [match[3], match[4]];
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

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
            lang: match[3],
            children: markdown.parse(match[4], ["text"]),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        return `\`\`\`${node.lang}\n${markdown.serialize(
            node.children,
            ""
        )}\n\`\`\``;
    }
}
