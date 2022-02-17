import reslate from "./reslate";
import reast from "./reast";

import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown, gfmToMarkdown } from "mdast-util-gfm";

const parserOptions = {
    //@ts-ignore
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
};

const serializerOptions = {
    extensions: [gfmToMarkdown()],
};

export const parse = (doc: string) => {
    if (doc.trim().length == 0) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
    }
    const ast = fromMarkdown(doc, parserOptions as any);
    const result = reslate(ast as any, {});
    return result;
};

export const serialize = (nodes: any) => {
    //@ts-ignore
    return toMarkdown(reast(nodes), serializerOptions);
};

export default {
    parse,
    serialize,
};
