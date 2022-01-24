import React from "react";
import { Record, List, Map } from "immutable";

export interface INode {
    id: string | null | undefined;
    type: string;
    value: string | number | List<INode>;
    attributes: Map<string, any>;
}

export interface IBlock {
    id: string | null | undefined;
    type: string;
    nodes: List<INode>;
    attributes: Map<string, any>;
}

export interface IEditor {
    blocks: List<IBlock>;
    selection: Selection | null;
    selected: List<INode>;
}

export interface IEComponent {
    children: any;
    editor: Editor;
}

export interface IBlockRenderArgs {
    block: IBlock;
    editor: Editor;
}

export interface INodeRenderArgs {
    node: INode;
    editor: Editor;
}

export type BlockRenderer = (
    args: IBlockRenderArgs
) => React.ReactElement | string | null;

export type NodeRenderer = (
    args: INodeRenderArgs
) => React.ReactElement | string | null;

export interface IEditorRenderer {
    renderBlock: BlockRenderer;
    renderNode: NodeRenderer;
}

export type IEditable = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "contentEditable"
> &
    Partial<IEditorRenderer>;

export class Node extends Record<INode>({
    id: null,
    value: "",
    type: "text",
    attributes: Map<string, any>(),
}) {}

export class Block extends Record<IBlock>({
    id: null,
    type: "paragraph",
    nodes: List<Node>(),
    attributes: Map<string, any>(),
}) {
    static create(type: string, nodes: List<Node>) {
        return new Block({ type: type, nodes: nodes });
    }
}

export class Editor extends Record<IEditor>({
    selection: null,
    blocks: List<IBlock>(),
    selected: List<INode>(),
}) {
    static create() {
        return new Editor();
    }

    replaceSelected(nodes: List<INode> | INode) {
        let new_nodes: List<INode>;
        if (!List.isList(nodes)) {
            new_nodes = (List(nodes as any) as any) as List<INode>;
        } else {
            new_nodes = nodes;
        }

        return new_nodes;
    }
}

function blockRenderer(_args: IBlockRenderArgs) {
    const renderer = useRenderer();
    console.log(renderer);
    return "renderd block";
}

function nodeRenderer(_args: INodeRenderArgs) {
    return "rendered node";
}

export const Context = React.createContext<Editor>(new Editor());

const defaultRenderer = {
    renderNode: nodeRenderer,
    renderBlock: blockRenderer,
};

export const Renderer = React.createContext<IEditorRenderer>(defaultRenderer);

export function useEditor() {
    return React.useContext(Context);
}

export function useRenderer() {
    return React.useContext(Renderer);
}

export function Notepad({ children, editor }: IEComponent) {
    return <Context.Provider value={editor}>{children}</Context.Provider>;
}

export const Editable = React.forwardRef<HTMLDivElement, IEditable>(
    (dprops, ref) => {
        const editor = useEditor();
        const { renderBlock, renderNode, ...props } = dprops;
        const renderer = React.useMemo<IEditorRenderer>(() => {
            let renderer = { ...defaultRenderer };
            if (renderNode) {
                (renderer as any).renderNode = renderNode;
            }
            if (renderBlock) {
                (renderer as any).renderBlock = renderBlock;
            }
            return renderer;
        }, [renderNode, renderBlock]);

        return (
            <Renderer.Provider value={renderer}>
                <div {...props} ref={ref} contentEditable={true}>
                    {editor.blocks.map((block) =>
                        renderer.renderBlock({ block, editor })
                    )}
                </div>
            </Renderer.Provider>
        );
    }
);

export type INotepad = typeof Notepad & {
    Node: typeof Node;
    Block: typeof Block;
    Editor: typeof Editor;
    Editable: typeof Editable;
    useEditor: typeof useEditor;
    useRenderer: typeof useRenderer;
    createEditor: typeof Editor.create;
};

(Notepad as INotepad).Node = Node;
(Notepad as INotepad).Block = Block;
(Notepad as INotepad).Editor = Editor;
(Notepad as INotepad).Editable = Editable;
(Notepad as INotepad).useEditor = useEditor;
(Notepad as INotepad).useRenderer = useRenderer;
(Notepad as INotepad).useRenderer = useRenderer;
(Notepad as INotepad).createEditor = Editor.create;

export default Notepad as INotepad;
