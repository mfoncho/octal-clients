import type { IComponent, Match, Node, IMarkdown } from "./types";

export interface ISight {
    index: number;
    component: IComponent;
}

export function gname(match: RegExpMatchArray) {
    const name = Object.keys(match.groups!).find((key) => match!.groups![key])!;
    return name.substring(1, name.length);
}

export function makepattern(components: IComponent[]) {
    return components.map((cmp) => `(?<$${cmp.name}>${cmp.pattern})`).join("|");
}

export default class Markdown implements IMarkdown {
    private components: IComponent[] = [];

    get spans() {
        return this.components
            .filter((cmp) => cmp.type === "span")
            .map((cmp) => cmp.name);
    }

    get blocks() {
        let blocks = this.components
            .filter((cmp) => cmp.type === "block")
            .map((cmp) => cmp.name);
        if (blocks.length == 0) {
            blocks = this.spans;
        }
        return blocks;
    }

    get types() {
        return [...this.blocks, ...this.spans];
    }

    add(cmp: IComponent) {
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

    remove(name: string, type?: string) {
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
        let gpattern = this.pattern(mode, opts);
        let pattern = gpattern;
        let sights: ISight[] = [];
        while (doc.length > 0 && basecomp) {
            let gmatch = pattern.exec(doc);
            let context = { types: [...opts] };
            if (gmatch && gmatch.groups) {
                let name = gname(gmatch);
                let component = this.component(name, mode);
                let match: Match | undefined | null = (
                    component ? component.match(doc, gmatch.index) : null
                ) as any;
                if (
                    sights.length > 0 &&
                    match &&
                    match.index > sights[sights.length - 1].index
                ) {
                    let start = sights[0].index + 1;
                    let components = sights.map(({ component }) => component);
                    let pattern = new RegExp(makepattern(components), "g");
                    pattern.lastIndex = start;
                    let smatch = pattern.exec(doc);
                    if (smatch && smatch.index < gmatch.index) {
                        let cmp = this.component(gname(smatch))!;
                        let cmatch = cmp.match(doc.substring(start));
                        if (cmatch) {
                            match = {
                                index: cmatch.index + start,
                                length: cmatch.length,
                            };
                            component = cmp;
                        } else {
                            sights = sights.filter((sight) => {
                                return sight.component.name !== cmp.name;
                            });
                            sights.push({
                                index: smatch.index,
                                component: cmp,
                            });

                            sights.sort((a, b) => {
                                return a.index - b.index;
                            });
                            continue;
                        }
                    }
                }
                if (component && match) {
                    const length = match.length;
                    if (match.index > 0) {
                        let substring = doc.substring(0, match.index);
                        let popts = opts.filter(
                            (opt) => component!.name !== opt
                        );
                        //let opts = mode == "block" ? ["paragraph"] : ["text"];
                        nodes = nodes.concat(this.parse(substring, popts));
                    }
                    let substring = doc.substring(
                        match.index,
                        match.length + match.index
                    );
                    const node = component.process(substring, context, this);
                    nodes.push(node);
                    doc = doc.substring(length + match.index, doc.length);
                    // restore pattern after match
                    pattern = gpattern;

                    // filter out backsighted matched that
                    // fall within current match range
                    sights = sights.filter((s) => {
                        return s.index > match!.index + match!.length;
                    });
                } else if (component) {
                    // remove component pattern
                    pattern = this.pattern(
                        mode,
                        opts.filter((cname) => cname !== name)
                    );
                    sights.push({ index: gmatch.index, component: component });
                    sights.sort((a, b) => {
                        return a.index - b.index;
                    });
                }
            } else if (sights.length > 0) {
                let components = sights.map(({ component }) => component);
                let pattern = new RegExp(makepattern(components), "g");
                pattern.lastIndex = sights[0].index + 1;
                let cmatch = pattern.exec(doc);
                if (cmatch) {
                    let threshold = cmatch!.index;
                    let cmp = this.component(gname(cmatch))!;
                    let match = cmp.match(doc.substring(cmatch.index));
                    if (match) {
                        if (cmatch.index > 0) {
                            let substring = doc.substring(0, cmatch.index);
                            let popts = opts.filter((opt) => cmp.name !== opt);
                            //let opts = mode == "block" ? ["paragraph"] : ["text"];
                            nodes = nodes.concat(this.parse(substring, popts));
                        }
                        let substring = doc.substring(
                            match.index + cmatch.index,
                            match.length + match.index + cmatch.index
                        );
                        const node = cmp.process(substring, context, this);
                        nodes.push(node);
                        doc = doc.substring(
                            cmatch.index + match.index + match.length,
                            doc.length
                        );
                        // restore pattern after match
                        pattern = gpattern;
                        threshold = threshold + match.index + match.length;
                    } else if (cmp) {
                        // remove component pattern
                        sights = sights.filter(
                            (sight) => sight.component.name !== cmp.name
                        );
                        sights.push({ index: cmatch.index, component: cmp });
                        sights.sort((a, b) => {
                            return a.index - b.index;
                        });
                    }
                    sights = sights.filter((sight) => {
                        return sight.index >= threshold;
                    });
                } else {
                    sights = [];
                }
            } else {
                let match: Match | undefined | null = basecomp.match(
                    doc
                ) as any;
                if (match) {
                    let substring = doc.substring(
                        match.index,
                        match.length + match.index
                    );
                    nodes.push(basecomp.process(substring, context, this));
                    doc = doc.substring(match.length, doc.length);
                    pattern.lastIndex = 0;
                }
            }
        }

        if (nodes.length == 0 && basecomp) {
            nodes.push(basecomp.process("", { types: [] }, this));
        }
        return nodes;
    }

    serialize(node: Node[] | Node, sep: string = "\n"): string {
        const nodes = Array.isArray(node) ? node : [node];
        return nodes
            .map((node) => {
                let component = this.components.find(
                    (comp) => comp.name === node.type
                );
                if (component) {
                    return component.serialize(node, this);
                }
                return "";
            })
            .join(sep);
    }

    pattern(mode: string, types: string[]) {
        const defaults = ["text", "paragraph"];
        let cmps = this.components.filter(
            (cmp) =>
                cmp.type == mode &&
                !defaults.includes(cmp.name) &&
                types.includes(cmp.name)
        );
        let pattern = makepattern(cmps);
        return new RegExp(pattern);
    }
}
