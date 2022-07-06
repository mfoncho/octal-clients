import React from "react";
import clx from "classnames";
import Text from "../Text";

function Suggestion({ selected, value }: any) {
    return (
        <div
            className={clx(
                "flex flex-row justify-between rounded w-full hover:bg-primary-500 hover:text-white text-base p-2",
                { ["bg-primary-500 text-white"]: selected }
            )}>
            <span>
                <Text>{value.value}</Text>
            </span>
        </div>
    );
}

function Table({ attributes, children, element }: any) {
    return (
        <table
            {...attributes}
            className="table-auto border-1 border-solid border-gray-500 border-collapse">
            <thead className="bg-gray-50">{children.slice(0, 1)}</thead>
            <tbody>{children.slice(1)}</tbody>
        </table>
    );
}

function TableRow({ attributes, children, element }: any) {
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

function Mention({ attributes, children, element }: any) {
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
    return (
        <div className="flex flex-row w-full">
            <div
                contentEditable={false}
                className="flex flex-row justify-start w-2 rounded-md bg-gray-300"
            />
            <blockquote {...attributes} className="pl-2">
                {children}
            </blockquote>
        </div>
    );
}

function Heading({ attributes, children, element }: any) {
    if (element.depth > 4) {
        return (
            <h5 {...attributes} className="font-semibold">
                {children}
            </h5>
        );
    }
    return (
        <h5 {...attributes} className="font-bold">
            {children}
        </h5>
    );
}

function List({ attributes, children, element }: any) {
    if (element.ordered) {
        return (
            <ol {...attributes} className="list-inside list-decimal">
                {children}
            </ol>
        );
    }
    return (
        <ul {...attributes} className="list-inside list-disc">
            {children}
        </ul>
    );
}

function ListItem({ attributes, children }: any) {
    return <li {...attributes}>{children}</li>;
}

function Link({ attributes, children, element }: any) {
    let href = element.url.startsWith("http")
        ? element.url
        : `//${element.url}`;
    return (
        <a
            {...attributes}
            href={href}
            target="_blank"
            className="text-primary-800">
            {children}
        </a>
    );
}

function Paragraph({ attributes, children }: any) {
    return <p {...attributes}>{children}</p>;
}

function Code({ children }: any) {
    return <code className="bg-gray-200 rounded px-1 py-0.5">{children}</code>;
}

function Pre({ children }: any) {
    return <pre className="bg-gray-200 rounded p-2">{children}</pre>;
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

const Leaf = ({ leaf, attributes, readonly, children }: any) => {
    const span = leaf;
    const Elements = useElements();

    if (leaf.bold) {
        children = (
            <Elements.Bold
                span={span}
                readonly={readonly}
                attributes={attributes}>
                {children}
            </Elements.Bold>
        );
    }

    if (leaf.italic) {
        children = (
            <Elements.Italic
                span={span}
                readonly={readonly}
                attributes={attributes}>
                {children}
            </Elements.Italic>
        );
    }

    if (leaf.underline) {
        children = (
            <Elements.Underline
                span={span}
                readonly={readonly}
                attributes={attributes}>
                {children}
            </Elements.Underline>
        );
    }

    if (leaf.strike) {
        children = (
            <Elements.Strike
                span={span}
                readonly={readonly}
                attributes={attributes}>
                {children}
            </Elements.Strike>
        );
    }

    if (leaf.code) {
        children = (
            <Elements.Code
                span={span}
                readonly={readonly}
                attributes={attributes}>
                {children}
            </Elements.Code>
        );
    }

    return (
        <Elements.Span readonly={readonly} attributes={attributes} span={span}>
            {children}
        </Elements.Span>
    );
};

const Element = (props: any) => {
    const {
        element: { type },
    } = props;

    const Elements = useElements();

    switch (type) {
        case "table":
            return <Elements.Table {...props} />;

        case "table-row":
            return <Elements.TableRow {...props} />;

        case "table-cell":
            return <Elements.TableCell {...props} />;

        case "mention":
            return <Elements.Mention {...props} />;

        case "emoji":
            return <Elements.Emoji {...props} />;

        case "blockquote":
            return <Elements.Blockquote {...props} />;

        case "heading":
            return <Elements.Heading {...props} />;

        case "list-item":
            return <Elements.ListItem {...props} />;

        case "inline-code":
            return <Elements.Code {...props} />;

        case "inline-code":
            return <Elements.Code {...props} />;

        case "list":
            return <Elements.List {...props} />;

        case "link":
            return <Elements.Link {...props} />;

        case "code":
            return <Elements.Pre {...props} />;

        case "paragraph":
            return <Elements.Paragraph {...props} />;

        default:
            return <Elements.Span {...props} />;
    }
};

export const defaultElements = {
    Mention: Mention,
    Suggestion: Suggestion,
    Emoji: Emoji,
    Leaf: Leaf,
    Span: Span,
    Bold: Bold,
    Pre: Pre,
    Code: Code,
    Italic: Italic,
    Strike: Strike,
    Table: Table,
    TableRow: TableRow,
    TableCell: TableCell,
    ListItem: ListItem,
    Blockquote: Blockquote,
    Underline: Underline,
    Heading: Heading,
    Link: Link,
    Paragraph: Paragraph,
    List: List,
    Element: Element,
};

const Elements =
    React.createContext<Partial<typeof defaultElements>>(defaultElements);

export function useElements() {
    return { ...defaultElements, ...React.useContext(Elements) };
}

type ElementsType = typeof Elements & { useElements: typeof useElements };

(Elements as any).useElements = useElements;

export default Elements as any as ElementsType;
