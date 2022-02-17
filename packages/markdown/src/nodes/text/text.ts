import type { IComponent, IMarkdown, Match } from "../../types";
import pattern from "./pattern";

const name = "text";

export default class Component implements IComponent {
    readonly name = name;

    readonly type = "span";

    readonly priority = -1;

    get pattern() {
        return pattern;
    }

    match(doc: string) {
        return new RegExp(pattern).exec(doc);
    }

    process(match: Match, _markdown: IMarkdown) {
        return { type: name, value: match[0] };
    }

    serialize(node: any, _markdown: IMarkdown): string {
        return node.value;
    }
}
