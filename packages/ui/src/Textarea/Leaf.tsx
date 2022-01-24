import React from "react";

export default function Leaf({ attributes, children, leaf }: any) {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underlined) {
        children = <u>{children}</u>;
    }

    if (leaf.strike) {
        children = <s>{children}</s>;
    }

    return <span {...attributes}>{children}</span>;
}
