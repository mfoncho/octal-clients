import reast from "./reast";
import reslate from "./reslate";
import * as nodes from "./nodes";
import Markdown from "./markdown";
import { IComponent } from "./types";

export default class Slater {
    markdown: Markdown;

    constructor(markdown: Markdown) {
        this.markdown = markdown;
    }

    static create() {
        const slater = new Slater(new Markdown());
        const hr = new nodes.Hr();
        const list = new nodes.List();
        const link = new nodes.Link();
        const text = new nodes.Text();
        const code = new nodes.Code();
        const bold = new nodes.Bold();
        const image = new nodes.Image();
        const emoji = new nodes.Emoji();
        const strike = new nodes.Strike();
        const italic = new nodes.Italic();
        const mention = new nodes.Mention();
        const heading = new nodes.Heading();
        const paragraph = new nodes.Paragraph();
        const blockquote = new nodes.Blockquote();

        slater.add(paragraph);
        slater.add(mention);
        slater.add(hr);
        slater.add(emoji);
        slater.add(image);
        slater.add(link);
        slater.add(list);
        slater.add(strike);
        slater.add(bold);
        slater.add(text);
        slater.add(heading);
        slater.add(italic);
        slater.add(code);
        slater.add(blockquote);
        return slater;
    }

    add(component: IComponent) {
        this.markdown.add(component);
        return this;
    }

    remove(name: string, type?: string) {
        this.markdown.remove(name, type);
        return this;
    }

    parse(doc: string) {
        let nodes = this.markdown.parse(doc);
        let snodes = nodes.map((node) => reslate(node));
        return snodes;
    }

    serialize(nodes: any) {
        return this.markdown.serialize(reast(nodes));
    }
}
