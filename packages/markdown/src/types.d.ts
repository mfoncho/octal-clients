export interface Span {
    type: string;
    children?: Span[];
    [prop: string]: any;
}

export interface Block extends Span {
    type: string;
    [prop: string]: any;
}

export type Node = Block | Span;

export interface Opts {
    [key: string]: any;
}

export interface Refs {
    [key: string]: string;
}

export interface Context {
    refs: Refs;
    spans: string[];
    blocks: string[];
}

export interface IMarkdown {
    types: string[];

    spans: string[];

    blocks: string[];

    parse(doc: string, opts?: string[]): Node[];

    serialize(nodes: Node[], sep?: string): string;
}

export type ComponentType = "block" | "span";

export interface Match extends RegExpExecArray {
    types: string[];
}

export interface IComponent {
    readonly name: string;
    readonly type: ComponentType;
    readonly pattern: string;
    readonly priority: number;
    match(doc: string): RegExpExecArray | null | undefined;
    process(match: Match, markdown: IMarkdown): Node;
    serialize(doc: Node, markdown: IMarkdown): string;
}
