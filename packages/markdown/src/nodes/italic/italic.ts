import type { IComponent, IMarkdown, Context } from "../../types";
import pattern, { markers } from "./pattern";

const name = "italic";

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
            let length = 0;
            let marker = match[2] ?? match[7];
            let mpattern = new RegExp(markers[marker as "*" | "_"], "g");
            let mmatch = mpattern.exec(doc);
            let bold = 0;
            let blank = " ";

            while ((mmatch = mpattern.exec(doc)) && length == 0) {
                let index = mmatch.index;
                let size = mmatch[0].length;
                let prechar = doc[index - 1];
                let strend = index + size;
                let postchar = doc[strend];
                if (size > 1) {
                    if (postchar !== blank && bold == 0) {
                        bold = size;
                    } else if (bold > 0 && prechar !== blank) {
                        bold = 0;
                        if (size > 2) {
                            length = strend;
                        }
                    }
                } else {
                    if (prechar == blank) {
                        break;
                    } else {
                        length = strend;
                    }
                }
            }
            if (length > 0) {
                return { index: match.index, length: length - match.index };
            }
        }
    }

    process(doc: string, { types }: Context, markdown: IMarkdown) {
        const spans = types.filter((name) => name !== this.name);
        return {
            type: this.name,
            children: markdown.parse(doc.substring(1, doc.length - 1), spans),
        };
    }

    serialize(block: any, markdown: IMarkdown): string {
        return `_${markdown.serialize(block.children, "")}_`;
    }
}
