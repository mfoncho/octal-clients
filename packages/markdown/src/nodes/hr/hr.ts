import type { IComponent, IMarkdown, Context } from "../../types";
import pattern from "./pattern";

const name = "hr";

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
        return {
            type: name,
            children: markdown.parse(doc.trim(), ["text"]),
        };
    }

    serialize(_node: any, markdown: IMarkdown): string {
        let token = "-";
        let marker = "";

        for (let i = 0; i < 80; i++) {
            marker = `${token}${marker}`;
        }
        return marker;
    }
}
