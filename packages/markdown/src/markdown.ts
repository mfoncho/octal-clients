import type { IComponent, Match, Node, IMarkdown } from "./types";

export default class Markdown implements IMarkdown {
    private components: IComponent[] = [];

    get spans() {
        return this.components
            .filter((cmp) => cmp.type === "span")
            .map((cmp) => cmp.name);
    }

    get blocks() {
        return this.components
            .filter((cmp) => cmp.type === "block")
            .map((cmp) => cmp.name);
    }

    get types() {
        return [...this.blocks, ...this.spans];
    }

    plug(cmp: IComponent) {
        let index = this.components.findIndex(
            (comp) => comp.type === cmp.type && comp.name === cmp.name
        );
        if (index == -1) {
            this.components.push(cmp);
            this.components.sort((a, b) => {
                if (a.priority > b.priority) {
                    return -1;
                } else if (a.priority < b.priority) {
                    return 1;
                }
                return 0;
            });
        } else {
            this.components[index] = cmp;
        }
        return cmp;
    }

    unplug(name: string, type?: string) {
        let index = -1;
        if (type) {
            index = this.components.findIndex(
                (comp) => comp.name === name && comp.type === type
            );
        } else {
            index = this.components.findIndex((comp) => comp.name === name);
        }
        if (index > -1) {
            this.components.splice(index, 1);
            return true;
        }
        return false;
    }

    component(name: string, type?: string): IComponent | undefined {
        let index = -1;
        if (type) {
            index = this.components.findIndex(
                (comp) => comp.name === name && comp.type === type
            );
        } else {
            index = this.components.findIndex((comp) => comp.name === name);
        }
        if (index > -1) {
            return this.components[index];
        }
    }

    parse(doc: string, opts = this.blocks): Node[] {
        let nodes: Node[] = [];
        let mode = opts.includes("text") ? "span" : "block";
        let basecomp = this.components.find(
            (cmp) => cmp.type == mode && cmp.priority === -1
        );
        let cmps = this.components
            .filter(
                (cmp) =>
                    cmp.type == mode &&
                    cmp.name !== basecomp?.name &&
                    opts.includes(cmp.name)
            )
            .map((cmp) => `(?<$${cmp.name}>${cmp.pattern})`)
            .join("|");
        let pattern = new RegExp(cmps);
        while (doc.length > 0 && basecomp) {
            let gmatch = pattern.exec(doc);
            if (gmatch && gmatch.groups) {
                let name = Object.keys(gmatch.groups).find(
                    (key) => gmatch!.groups![key]
                )!;
                name = name.substring(1, name.length);
                let component = this.components.find((cmp) => cmp.name == name);
                let match: Match | undefined | null = (
                    component ? component.match(doc) : null
                ) as any;
                if (component && match) {
                    const length = match[0].length;
                    if (match.index > 0) {
                        const substring = doc.substring(0, match.index);
                        let opts = mode == "block" ? ["paragraph"] : ["text"];
                        nodes = nodes.concat(this.parse(substring, opts));
                    }
                    match.types = [...opts];
                    const node = component.process(match, this);
                    nodes.push(node);
                    doc = doc.substring(length + match.index, doc.length);
                } else {
                    // If component fails to match its own pattern
                    // then the doc will be proccessed by the basecomp
                    let match: Match | undefined | null = basecomp.match(
                        doc
                    ) as any;
                    if (match) {
                        match.types = [...opts];
                        nodes.push(basecomp.process(match, this));
                        doc = doc.substring(match[0].length, doc.length);
                    }
                }
            } else {
                let match: Match | undefined | null = basecomp.match(
                    doc
                ) as any;
                if (match) {
                    match.types = [...opts];
                    nodes.push(basecomp.process(match, this));
                    doc = doc.substring(match[0].length, doc.length);
                }
            }
        }
        if (nodes.length == 0 && basecomp) {
            let match: Match = basecomp.match("") as any;
            nodes.push(basecomp.process(match, this));
        }
        return nodes;
    }

    serialize(node: Node[] | Node, sep: string = "\n"): string {
        const nodes = Array.isArray(node) ? node : [node];
        return nodes.map((node) => this.serializeNode(node)).join(sep);
    }

    private serializeNode(node: Node): string {
        let component = this.components.find((comp) => comp.name === node.type);
        if (component) {
            return component.serialize(node, this);
        }
        return "";
    }
}
