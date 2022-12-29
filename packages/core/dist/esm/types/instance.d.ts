import { ViewportHelperFunctions, Viewport, Node, Edge, Rect } from '.';
export declare type ReactFlowJsonObject<NodeData = any, EdgeData = any> = {
    nodes: Node<NodeData>[];
    edges: Edge<EdgeData>[];
    viewport: Viewport;
};
export declare type DeleteElementsOptions = {
    nodes?: (Partial<Node> & {
        id: Node['id'];
    })[];
    edges?: (Partial<Edge> & {
        id: Edge['id'];
    })[];
};
export declare namespace Instance {
    type GetNodes<NodeData> = () => Node<NodeData>[];
    type SetNodes<NodeData> = (payload: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[])) => void;
    type AddNodes<NodeData> = (payload: Node<NodeData>[] | Node<NodeData>) => void;
    type GetNode<NodeData> = (id: string) => Node<NodeData> | undefined;
    type GetEdges<EdgeData> = () => Edge<EdgeData>[];
    type SetEdges<EdgeData> = (payload: Edge<EdgeData>[] | ((edges: Edge<EdgeData>[]) => Edge<EdgeData>[])) => void;
    type GetEdge<EdgeData> = (id: string) => Edge<EdgeData> | undefined;
    type AddEdges<EdgeData> = (payload: Edge<EdgeData>[] | Edge<EdgeData>) => void;
    type ToObject<NodeData = any, EdgeData = any> = () => ReactFlowJsonObject<NodeData, EdgeData>;
    type DeleteElements = ({ nodes, edges }: DeleteElementsOptions) => void;
    type GetIntersectingNodes<NodeData> = (node: (Partial<Node<NodeData>> & {
        id: Node['id'];
    }) | Rect, partially?: boolean, nodes?: Node<NodeData>[]) => Node<NodeData>[];
    type IsNodeIntersecting<NodeData> = (node: (Partial<Node<NodeData>> & {
        id: Node['id'];
    }) | Rect, area: Rect, partially?: boolean) => boolean;
}
export declare type ReactFlowInstance<NodeData = any, EdgeData = any> = {
    getNodes: Instance.GetNodes<NodeData>;
    setNodes: Instance.SetNodes<NodeData>;
    addNodes: Instance.AddNodes<NodeData>;
    getNode: Instance.GetNode<NodeData>;
    getEdges: Instance.GetEdges<EdgeData>;
    setEdges: Instance.SetEdges<EdgeData>;
    addEdges: Instance.AddEdges<EdgeData>;
    getEdge: Instance.GetEdge<EdgeData>;
    toObject: Instance.ToObject<NodeData, EdgeData>;
    deleteElements: Instance.DeleteElements;
    getIntersectingNodes: Instance.GetIntersectingNodes<NodeData>;
    isNodeIntersecting: Instance.IsNodeIntersecting<NodeData>;
    viewportInitialized: boolean;
} & Omit<ViewportHelperFunctions, 'initialized'>;
//# sourceMappingURL=instance.d.ts.map