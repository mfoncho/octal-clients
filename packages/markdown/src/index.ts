import reslate from "./reslate";
import reast from "./reast";

import Markdown from "./markdown";
import Hr from "./nodes/hr";
import List from "./nodes/list";
import Text from "./nodes/text";
import Code from "./nodes/code";
import Bold from "./nodes/strong";
import Emoji from "./nodes/emoji";
import Link from "./nodes/link";
import Image from "./nodes/image";
import Italic from "./nodes/emphasis";
import Strike from "./nodes/strike";
import Heading from "./nodes/heading";
import Paragraph from "./nodes/paragraph";
import Blockquote from "./nodes/blockquote";
import Mention from "./nodes/mention";

function build() {
    const markdown = new Markdown();
    const paragraph = new Paragraph();
    const heading = new Heading();
    const blockquote = new Blockquote();
    const list = new List();
    const hr = new Hr();
    const emoji = new Emoji();
    const link = new Link();
    const text = new Text();
    const mention = new Mention();
    const italic = new Italic();
    const code = new Code();
    const strike = new Strike();
    const bold = new Bold();
    const image = new Image();
    markdown.plug(paragraph);
    markdown.plug(mention);
    markdown.plug(hr);
    markdown.plug(emoji);
    markdown.plug(image);
    markdown.plug(link);
    markdown.plug(list);
    markdown.plug(strike);
    markdown.plug(bold);
    markdown.plug(text);
    markdown.plug(heading);
    markdown.plug(italic);
    markdown.plug(code);
    markdown.plug(blockquote);
    return markdown;
}

const md = build();

export const parse = (doc: string) => {
    let nodes = md.parse(doc);
    let slate = nodes.map((node) => reslate(node));
    return slate;
};

export const serialize = (nodes: any) => {
    return md.serialize(reast(nodes));
};

export default {
    parse,
    serialize,
};
