import React from "react";
import { Node } from "unist";
import { Slater } from "@colab/markdown";
import Elements from "../Elements";

const slater = Slater.create();

type TableAlignT =
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";

export interface IENode extends Node {
    identifier?: any;
    lang?: string;
    ordered?: boolean;
    index: number;
    depth?: number;
    parts?: any;
    parent?: IENode;
    value: string;
    title: string;
    alt: string;
    checked: boolean;
    label: string;
    url: string;
    align: TableAlignT[];
    children?: IENode[];
}

export interface IMProps {
    image?: boolean;
    code?: boolean;
    list?: boolean;
    strong?: boolean;
    emphasis?: boolean;
    table?: boolean;
    link?: boolean;
    strike?: boolean;
    heading?: boolean;
    blockquote?: boolean;
    classes: any;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h5?: boolean;
    h6?: boolean;
    children: string | React.ReactChildren | any;
    onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    onHighlightClick?: (e: React.MouseEvent, node: any) => void;
}

export interface IMState {
    source: string;
    parsed: string[];
    codeStyles?: any;
    codeLineProps?: any;
}

function clone(el: any, key: number) {
    if (el && el.symbol) {
        return React.cloneElement(el, { key: String(key) });
    }
    return el;
}

function render(
    node: any,
    Components: ReturnType<typeof Elements.useElements>,
    key?: number
): any {
    if (Array.isArray(node)) {
        return node.map((val, key) => {
            const el = render(val, Components, key);
            return clone(el, key);
        });
    }
    if (Array.isArray(node.children)) {
        const children = node.children.map((val: any, key: number) => {
            const el = render(val, Components, key);
            return clone(el, key);
        });
        return (
            <Components.Element readonly={true} element={node} key={key}>
                {children}
            </Components.Element>
        );
    }
    return (
        <Components.Leaf readonly={true} leaf={node} key={key}>
            {node.text}
        </Components.Leaf>
    );
}
//@wip
export default React.memo<any>((props: any) => {
    const Components = Elements.useElements();
    let parsed: any[] = [];
    if (typeof props.children == "string") {
        parsed = slater.parse(props.children);
    } else if (Array.isArray(props.children)) {
        parsed = props.children;
    }
    return <React.Fragment>{render(parsed, Components, -1)}</React.Fragment>;
});
