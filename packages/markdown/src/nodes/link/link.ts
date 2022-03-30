import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "link";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = 0;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        let match = new RegExp(pattern).exec(doc);
        if (match) return { index: match.index, length: match[0].length };
    }

    process(doc: string, { types }: Context, markdown: IMarkdown) {
        let match = new RegExp(pattern).exec(doc)!;
        return {
            url: match[5] ?? match[6],
            type: this.name,
            pure:
                (match[5] ?? match[6]).trim() == (match[2] ?? match[6]).trim(),
            children: markdown.parse(
                match[2] ?? match[6],
                types.filter((type) => type !== this.name)
            ),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        if (node.pure && node.children.length == 1) {
            const [child] = node.children;
            if (child.type === "text" && child.value.trim() === "") {
                return child.text;
            }
        }
        return `[${markdown.serialize(node.children, "")}](${node.url})`;
    }
}
