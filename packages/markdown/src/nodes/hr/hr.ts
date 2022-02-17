import type { IComponent, IMarkdown, Match } from "../../types";
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
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, markdown: IMarkdown) {
        let doc = match[0] ?? match[1] ?? match[2];
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
