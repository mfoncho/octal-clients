import type { IComponent, IMarkdown, Match, Node } from "../../types";
import pattern from "./pattern";

const name = "blockquote";

export function parse(doc: string): string {
    return doc
        .split("\n")
        .map((line) => line.substring(2, line.length))
        .join("\n")
        .trim();
}

const regex = new RegExp(pattern);

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "block";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return regex.exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        const subsrt = parse(match[0]);
        return {
            type: name,
            children: markdown.parse(subsrt),
        };
    }

    serialize(node: Node, markdown: IMarkdown): string {
        return node
            .children!.map((node) => markdown.serialize([node], "").split("\n"))
            .flat()
            .map((node) => `> ${node}`)
            .join("\n");
    }
}
