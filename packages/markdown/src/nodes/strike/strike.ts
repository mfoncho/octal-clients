import type { IComponent, IMarkdown, Context } from "../../types";
import { repad } from "../utils";
import pattern from "./pattern";

const name = "strike";

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
        const spans = types.filter((name) => name !== this.name);
        return {
            type: this.name,
            children: markdown.parse(doc.substring(2, doc.length - 2), spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        let serialized = markdown.serialize(block.children, "");
        return repad(serialized, "~~");
    }
}
