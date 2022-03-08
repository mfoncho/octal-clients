import React from "react";
import clx from "classnames";

function Mention({ selected, mention }: any) {
    const { value } = mention as any;
    return (
        <div
            className={clx(
                "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white p-2",
                { ["bg-primary-500 text-white"]: selected }
            )}>
            <span>{value}</span>
        </div>
    );
}

function Table({ attributes, children }: any) {
    return (
        <>
            <br />
            <table
                {...attributes}
                className="table-auto border-1 border-solid border-gray-500 border-collapse">
                <thead className="bg-gray-50">{children.slice(0, 1)}</thead>
                <tbody>{children.slice(1)}</tbody>
            </table>
            <br />
        </>
    );
}

function TableRow({ attributes, children }: any) {
    return <tr {...attributes}>{children}</tr>;
}

function TableCell({ attributes, children, element }: any) {
    if (element.head) {
        return (
            <th {...attributes} className="border px-4 py-2">
                {children}
            </th>
        );
    } else {
        return (
            <td {...attributes} className="border px-4 py-2">
                {children}
            </td>
        );
    }
}

function Mentioned({ attributes, children, element }: any) {
    return (
        <span {...attributes} contentEditable={false}>
            <span className="px-1 pb-0.5 my-0.5 bg-primary-500 text-white rounded-full font-semibold text-sm">
                {element.value}
            </span>
            <span>{children}</span>
        </span>
    );
}

function Emoji({ attributes, children, element }: any) {
    return (
        <span {...attributes} contentEditable={false} className="emoji-wrapper">
            <img
                alt={element.emoji}
                src={element.src}
                className="inline emoji"
            />
            {children}
        </span>
    );
}

function Blockquote({ attributes, children }: any) {
    return <blockquote {...attributes}>{children}</blockquote>;
}

function Heading5({ attributes, children }: any) {
    return (
        <h5 {...attributes} className="font-bold">
            {children}
        </h5>
    );
}

function Heading6({ attributes, children }: any) {
    return (
        <h5 {...attributes} className="font-semibold">
            {children}
        </h5>
    );
}

const Heading1 = Heading5;
const Heading2 = Heading5;
const Heading3 = Heading5;
const Heading4 = Heading5;

function ListItem({ attributes, children }: any) {
    return <li {...attributes}>{children}</li>;
}

function BulletedList({ attributes, children }: any) {
    return (
        <ul {...attributes} className="list-inside p-2">
            {children}
        </ul>
    );
}

function NumberedList({ attributes, children }: any) {
    return (
        <ol {...attributes} className="list-inside p-2">
            {children}
        </ol>
    );
}

function Link({ attributes, children, element }: any) {
    return (
        <a {...attributes} href={element.url} className="text-primary-800">
            {children}
        </a>
    );
}

function Paragraph({ attributes, children }: any) {
    return (
        <span {...attributes} className="block">
            {children}
        </span>
    );
}

function Code({ children }: any) {
    return <code className="bg-gray-200 rounded p-0.5">{children}</code>;
}

function Bold({ children }: any) {
    return <strong>{children}</strong>;
}

function Italic({ children }: any) {
    return <em>{children}</em>;
}

function Span({ attributes, children }: any) {
    return <span {...attributes}>{children}</span>;
}

function Underline({ children }: any) {
    return <u>{children}</u>;
}

function Strike({ children }: any) {
    return <s>{children}</s>;
}

const Leaf = ({ leaf, attributes, children }: any) => {
    const span = leaf;
    const Component = useComponents();

    if (leaf.bold) {
        children = (
            <Component.Bold attributes={attributes} span={span}>
                {children}
            </Component.Bold>
        );
    }

    if (leaf.italic) {
        children = (
            <Component.Italic attributes={attributes} span={span}>
                {children}
            </Component.Italic>
        );
    }

    if (leaf.underline) {
        children = (
            <Component.Underline attributes={attributes} span={span}>
                {children}
            </Component.Underline>
        );
    }

    if (leaf.strike) {
        children = (
            <Component.Strike attributes={attributes} span={span}>
                {children}
            </Component.Strike>
        );
    }

    if (leaf.code) {
        children = (
            <Component.Code attributes={attributes} span={span}>
                {children}
            </Component.Code>
        );
    }

    return (
        <Component.Span attributes={attributes} span={span}>
            {children}
        </Component.Span>
    );
};

const Element = (props: any) => {
    const {
        element: { type },
    } = props;

    const Elements = useComponents();

    switch (type) {
        case "table":
            return <Elements.Table {...props} />;

        case "table-row":
            return <Elements.TableRow {...props} />;

        case "table-cell":
            return <Elements.TableCell {...props} />;

        case "mention":
            return <Elements.Mentioned {...props} />;

        case "emoji":
            return <Elements.Emoji {...props} />;

        case "blockquote":
            return <Elements.Blockquote {...props} />;

        case "heading-one":
            return <Elements.Heading1 {...props} />;

        case "heading-two":
            return <Elements.Heading2 {...props} />;

        case "heading-three":
            return <Elements.Heading3 {...props} />;

        case "heading-four":
            return <Elements.Heading4 {...props} />;

        case "heading-five":
            return <Elements.Heading5 {...props} />;

        case "heading-six":
            return <Elements.Heading6 {...props} />;

        case "list-item":
            return <Elements.ListItem {...props} />;

        case "bulleted-list":
            return <Elements.BulletedList {...props} />;

        case "numbered-list":
            return <Elements.NumberedList {...props} />;

        case "link":
            return <Elements.Link {...props} />;

        default:
            return <Elements.Paragraph {...props} />;
    }
};

export const defaultComponents = {
    Mentioned: Mentioned,
    Mention: Mention,
    Emoji: Emoji,
    Leaf: Leaf,
    Span: Span,
    Bold: Bold,
    Code: Code,
    Italic: Italic,
    Strike: Strike,
    Table: Table,
    TableRow: TableRow,
    TableCell: TableCell,
    ListItem: ListItem,
    Blockquote: Blockquote,
    Underline: Underline,
    Heading1: Heading1,
    Heading2: Heading2,
    Heading3: Heading3,
    Heading4: Heading4,
    Heading5: Heading5,
    Heading6: Heading6,
    Link: Link,
    Paragraph: Paragraph,
    BulletedList: BulletedList,
    NumberedList: NumberedList,
    Element: Element,
};

const Components =
    React.createContext<Partial<typeof defaultComponents>>(defaultComponents);

export function useComponents() {
    return { ...defaultComponents, ...React.useContext(Components) };
}

export default Components;
