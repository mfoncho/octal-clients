import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "paragraph";

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
            type: name,
            children: markdown.parse(match[0].trim(), markdown.spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return markdown.serialize(block.children, "");
    }
}
