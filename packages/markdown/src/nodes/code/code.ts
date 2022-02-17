import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "code";

export function parse(doc: string): [string, string] {
    let match = new RegExp(pattern).exec(doc)!;
    return [match[3], match[4]];
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = -1;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
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
