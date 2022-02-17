import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "heading";

export function parse(match: RegExpExecArray): [number, string] {
    if (match[5] && match[6]) {
        return [match[5].length, match[6]];
    } else {
        return [match[13] === "=" ? 1 : 2, match[8]];
    }
}

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        const [depth, doc] = parse(match);
        return {
            type: name,
            depth: depth,
            children: markdown.parse(doc, markdown.spans),
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
