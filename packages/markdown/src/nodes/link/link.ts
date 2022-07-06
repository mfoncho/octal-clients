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
        let pure = false;
        let content = "";
        let url = match[0];
        if (match[0] == match[6]) {
            pure = true;
            url = match[0];
            content = match[0];
        } else {
            pure = false;
            url = match[5];
            content = match[2];
        }
        return {
            url: url,
            type: this.name,
            pure: pure,
            children: markdown.parse(
                content,
                pure
                    ? types.filter((type) => type === "text")
                    : types.filter((type) => type !== this.name)
            ),
        };
    }

    serialize(node: any, markdown: IMarkdown): string {
        if (node.pure && node.children.length == 1) {
            const [child] = node.children;
            if (child.type === "text") {
                return child.value;
            }
        }
        return `[${markdown.serialize(node.children, "")}](${node.url})`;
    }
}
