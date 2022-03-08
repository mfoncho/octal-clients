import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "strong";

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
            let length = match[0].length;
            return { index: match.index, length };
        }
    }

    process(match: string, { types }: Context, markdown: IMarkdown) {
        const size = 2;
        const doc = match.substring(size, match.length - size);
        const spans = types.filter((name) => name !== this.name);
        return {
            type: this.name,
            children: markdown.parse(doc, spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return `**${markdown.serialize(block.children, "")}**`;
    }
}
