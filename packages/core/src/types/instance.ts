/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ViewportHelperFunctions, Viewport, Node, Edge, Rect } from '.';

export type ReactFlowJsonObject<NodeData = any, EdgeData = any> = {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  viewport: Viewport;
};

export type DeleteElementsOptions = {
  nodes?: (Partial<Node> & { id: Node['id'] })[];
  edges?: (Partial<Edge> & { id: Edge['id'] })[];
};
export namespace Instance {
  export type GetNodes<NodeData> = () => Node<NodeData>[];
  export type SetNodes<NodeData> = (
    payload: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[])
  ) => void;
  export type AddNodes<NodeData> = (payload: Node<NodeData>[] | Node<NodeData>) => void;
  export type GetNode<NodeData> = (id: string) => Node<NodeData> | undefined;
  export type GetEdges<EdgeData> = () => Edge<EdgeData>[];
  export type SetEdges<EdgeData> = (
    payload: Edge<EdgeData>[] | ((edges: Edge<EdgeData>[]) => Edge<EdgeData>[])
  ) => void;
  export type GetEdge<EdgeData> = (id: string) => Edge<EdgeData> | undefined;
  export type AddEdges<EdgeData> = (payload: Edge<EdgeData>[] | Edge<EdgeData>) => void;
  export type ToObject<NodeData = any, EdgeData = any> = () => ReactFlowJsonObject<NodeData, EdgeData>;
  export type DeleteElements = ({ nodes, edges }: DeleteElementsOptions) => void;
  export type GetIntersectingNodes<NodeData> = (
    node: (Partial<Node<NodeData>> & { id: Node['id'] }) | Rect,
    partially?: boolean,
    nodes?: Node<NodeData>[]
  ) => Node<NodeData>[];
  export type IsNodeIntersecting<NodeData> = (
    node: (Partial<Node<NodeData>> & { id: Node['id'] }) | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;
}

export type ReactFlowInstance<NodeData = any, EdgeData = any> = {
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
