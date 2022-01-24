import emoji from "@octal/emoji";
import * as patterns from "@octal/patterns";

export interface ILocation {
    line: number;
    column: number;
    offset: number;
}

export interface IPosition {
    start: ILocation;
    ident: any;
    end: ILocation;
}

export interface INode {
    type: string;
    align?: string[];
    value?: string;
    position: IPosition;
    children?: INode[];
    [key: string]: any;
}

export interface IProps {
    [key: string]: any;
}

function lower(nodes: INode[]): any {
    nodes = nodes
        .map((val: any) => {
            if (val.type == "paragraph") {
                return val.children;
            }
            return val;
        })
        .flat();
    if (nodes.length == 0) {
        nodes = [{ text: "" }] as any;
    }
    return nodes;
}

export default function reslate(root: INode, props: IProps = {}): any {
    let children = root.children ?? [];
    switch (root.type) {
        case "root":
            return root.children!.map((node) => reslate(node)).flat();

        case "paragraph":
            children = children.map((node) => reslate(node));
            props = { type: "paragraph", children: children.flat() };
            break;

        case "link":
            children = children.map((node) => reslate(node)).flat();
            props = { type: "link", url: root.url, children: lower(children) };
            break;

        case "delete":
            props = { ...props, strike: true };
            return children.map((node) => reslate(node, props)).flat();

        case "strong":
            props = { ...props, bold: true };
            return children.map((node) => reslate(node, props)).flat();

        case "emphasis":
            props = { ...props, italic: true };
            return children.map((node) => reslate(node, props)).flat();

        case "tableRow":
            children = children.map((node) => reslate(node, props)).flat();
            return { ...props, type: "table-row", children: children };

        case "tableCell":
            children = children.map((node) => reslate(node)).flat();
            return { ...props, type: "table-cell", children: lower(children) };

        case "table":
            children = children
                .map((node, index) => reslate(node, { head: index == 0 }))
                .flat();
            return { type: "table", align: root.align, children: children };

        case "heading":
            children = children.map((node) => reslate(node)).flat();
            return {
                type: "heading",
                depth: root.depth,
                children: lower(children),
            };

        case "list":
            children = children
                .map((node, index) =>
                    reslate(node, {
                        ...props,
                        index: index,
                        spread: root.spread,
                        ordered: root.ordered,
                    })
                )
                .flat();
            return {
                type: "list",
                spread: root.spread ?? false,
                ordered: root.ordered,
                children: children,
            };

        case "listItem":
            children = children.map((node) => reslate(node)).flat();
            return {
                type: "list-item",
                index: props.index,
                spread: props.spread,
                ordered: props.ordered,
                children: lower(children),
                checked: root.checked ?? null,
            };

        case "blockquote":
            children = children.map((node) => reslate(node, props)).flat();
            if (children.length == 0) {
                children = [{ text: "" }] as any;
            }
            return { type: "blockquote", children: children };

        case "inlineCode":
            children = [{ text: root.value }] as any;
            return {
                type: "inline-code",
                children: children,
            };

        case "code":
            children = [{ text: root.value }] as any;
            return {
                type: "code",
                lang: root.lang,
                meta: root.meta,
                children: children,
            };

        default:
            if (root.children) {
                console.log(root);
            }
            break;
    }

    if (typeof root.value === "string") {
        let parts = root.value.split("\n");
        if (parts.length > 1) {
            return parts
                .map((value) => {
                    let children: any = [];
                    if (value.trim() === "") {
                        children = {
                            type: "paragraph",
                            children: [{ text: value }],
                        };
                    } else {
                        const parsed = parse(value);
                        if (parsed.length > 0) {
                            children = parsed;
                        } else {
                            children = [{ ...props, text: value }];
                        }
                    }
                    return { type: "paragraph", children: children };
                })
                .flat();
        } else {
            const parsed = parse(root.value);
            if (parsed.length > 0) {
                return parsed;
            } else {
                const text = props.value
                    ? props.value + root.value
                    : root.value;
                return { ...props, text: text };
            }
        }
    } else {
        if (Object.keys(props).length == 0) return [];
        return props;
    }
}

export function parse(text: string): any {
    const parsed: any = [];

    let prev = null;
    let match = null;

    const regex = new RegExp(`(${patterns.mention})|(${patterns.emoji})`, "g");

    while ((match = regex.exec(text))) {
        if (match.index !== 0) {
            if (prev) {
                parsed.push({
                    text: text.substring(
                        prev.index + prev[0].length,
                        match.index
                    ),
                });
            } else {
                parsed.push({ text: text.substring(0, match.index) });
            }
        }

        const prefix = match[0][0];

        switch (prefix) {
            case "@":
            case "#":
                parsed.push({ text: "" });
                parsed.push({
                    type: "mention",
                    value: match[1],
                    prefix: prefix,
                    children: [{ text: "" }],
                });
                parsed.push({ text: "" });
                break;

            default:
                parsed.push({ text: "" });
                parsed.push({
                    src: emoji.image(match[0]) ?? "",
                    type: "emoji",
                    emoji: match[0],
                    children: [{ text: "" }],
                });
                parsed.push({ text: "" });
                break;
        }

        prev = match;
    }

    if (prev && prev.index + prev[0].length < text.length - 1) {
        parsed.push({
            text: text.substring(prev.index + prev[0].length, text.length),
        });
    }

    return parsed;
}
