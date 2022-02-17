export interface SlateNode {
    type?: string;
    text?: string;
    children?: SlateNode[];
    [key: string]: any;
}

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
    position?: IPosition;
    children?: INode[];
    [key: string]: any;
}

export interface IProps {
    [key: string]: any;
}

export default function reast(node: SlateNode[] | SlateNode): INode {
    if (Array.isArray(node)) {
        return {
            type: "root",
            children: node.map(reast),
        };
    }
    switch (node.type) {
        case "paragraph":
            return {
                type: "paragraph",
                children: node.children!.map(reast),
            };

        case "list":
            return {
                type: "list",
                spread: node.spread ?? false,
                ordered: node.ordered ?? false,
                children: node.children!.map(reast),
            };

        case "heading":
            return {
                type: "heading",
                depth: node.depth ?? 5,
                children: node.children!.map(reast),
            };

        case "list-item":
            return {
                type: "listItem",
                spread: node.spread ?? false,
                checked: node.checked ?? null,
                children: node.children!.map(reast),
            };

        case "link":
            return {
                type: "link",
                url: node.url,
                title: node.title,
                children: node.children!.map(reast),
            };

        case "table":
            return {
                type: "table",
                align: node.align,
                children: node.children!.map(reast),
            };

        case "table-row":
            return {
                type: "tableRow",
                children: node.children!.map(reast),
            };

        case "table-cell":
            return {
                type: "tableCell",
                children: node.children!.map(reast),
            };

        case "blockquote":
            return { type: "blockquote", children: node.children!.map(reast) };

        case "mention": {
            const { value } = node;
            return {
                type: "text",
                value: `${value}`,
            };
        }

        case "emoji": {
            const { emoji } = node;
            return {
                type: "text",
                value: emoji,
            };
        }

        case "code": {
            const [{ text }] = node.children!;
            return {
                type: "code",
                lang: node.lang,
                meta: node.meta,
                value: text,
            };
        }

        case "inline-code": {
            const [{ text }] = node.children!;
            return {
                type: "inlineCode",
                value: text,
            };
        }

        default: {
            let known = ["bold", "strike", "italic"];
            let types = Object.keys(node).filter((key) => known.includes(key));
            if (types.length > 0) {
                let type = types.shift()!;
                node = { ...node };
                delete node[type];
                switch (type) {
                    case "bold":
                        return { type: "strong", children: [reast(node)] };

                    case "strike":
                        return { type: "delete", children: [reast(node)] };

                    case "italic":
                        return { type: "emphasis", children: [reast(node)] };

                    default:
                        break;
                }
            }
            return { type: "text", value: node.text };
        }
    }
}
