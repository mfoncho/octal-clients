import type { Node } from "./types";
import emoji from "@octal/emoji";

export interface IProps {
    [key: string]: any;
}

export interface IOpts {
    paragraph?: boolean;
}

export default function reslate(
    root: Node,
    props: IProps = {},
    opts: IOpts = {}
): any {
    let children = root.children ?? [];
    switch (root.type) {
        case "paragraph":
            children = children.map((node) => reslate(node));
            return { type: "paragraph", children: children.flat() };

        case "link":
            children = children.map((node) => reslate(node, props));
            return {
                type: "link",
                url: root.url,
                pure: root.pure,
                children: children,
            };

        case "strike":
            props = { ...props, strike: true };
            return children.map((node) => reslate(node, props)).flat();

        case "strong":
            props = { ...props, bold: true };
            return children.map((node) => reslate(node, props)).flat();

        case "emphasis":
            props = { ...props, italic: true };
            return children.map((node) => reslate(node, props)).flat();

        case "heading":
            children = children.map((node) => reslate(node)).flat();
            return {
                type: "heading",
                depth: root.depth,
                children: children,
            };

        case "list":
            children = children
                .map((node, index) =>
                    reslate(node, {
                        ...props,
                        index: index,
                        ordered: root.ordered,
                    })
                )
                .flat();
            return {
                type: "list",
                ordered: root.ordered,
                children: children,
            };

        case "list-item":
            children = children.map((node) => reslate(node)).flat();
            return {
                type: "list-item",
                index: props.index,
                //spread: props.spread,
                ordered: props.ordered,
                checked: root.checked,
                children: children,
            };

        case "hr":
            return { type: "hr", children: [{ text: "" }] };

        case "emoji":
            return {
                type: "emoji",
                emoji: root.emoji,
                src: emoji.image(root.emoji),
                children: [{ text: "" }],
            };

        case "mention":
            return {
                type: "mention",
                name: root.name,
                value: root.value,
                entity: root.entity,
                children: [{ text: "" }],
            };

        case "blockquote":
            children = children.map((node) => reslate(node, props)).flat();
            if (children.length == 0) {
                children = [{ text: "" }] as any;
            }
            return { type: "blockquote", children: children };

        case "inlinecode":
            return {
                text: root.children![0].value,
                code: true,
            };

        case "code":
            return {
                type: "code",
                lang: root.lang,
                meta: root.meta,
                //children: children,
                children: root.children!.map((node) => reslate(node)),
            };

        case "text":
            return { ...props, text: root.value };

        default:
            break;
    }
}
