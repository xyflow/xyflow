/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import type { Rect, Viewport } from '@xyflow/system';
import type { Node, Edge, ViewportHelperFunctions } from '.';

export type ReactFlowJsonObject<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes: NodeType[];
  edges: EdgeType[];
  viewport: Viewport;
};

export type DeleteElementsOptions = {
  nodes?: (Node | { id: Node['id'] })[];
  edges?: (Edge | { id: Edge['id'] })[];
};

export namespace Instance {
  export type GetNodes<NodeType extends Node = Node> = () => NodeType[];
  export type SetNodes<NodeType extends Node = Node> = (
    payload: NodeType[] | ((nodes: NodeType[]) => NodeType[])
  ) => void;
  export type AddNodes<NodeType extends Node = Node> = (payload: NodeType[] | NodeType) => void;
  export type GetNode<NodeType extends Node = Node> = (id: string) => NodeType | undefined;
  export type GetEdges<EdgeType extends Edge = Edge> = () => EdgeType[];
  export type SetEdges<EdgeType extends Edge = Edge> = (
    payload: EdgeType[] | ((edges: EdgeType[]) => EdgeType[])
  ) => void;
  export type GetEdge<EdgeType extends Edge = Edge> = (id: string) => EdgeType | undefined;
  export type AddEdges<EdgeType extends Edge = Edge> = (payload: EdgeType[] | EdgeType) => void;
  export type ToObject<NodeType extends Node = Node, EdgeType extends Edge = Edge> = () => ReactFlowJsonObject<
    NodeType,
    EdgeType
  >;
  export type DeleteElements = ({ nodes, edges }: DeleteElementsOptions) => {
    deletedNodes: Node[];
    deletedEdges: Edge[];
  };
  export type GetIntersectingNodes<NodeType extends Node = Node> = (
    node: NodeType | { id: Node['id'] } | Rect,
    partially?: boolean,
    nodes?: NodeType[]
  ) => NodeType[];
  export type IsNodeIntersecting<NodeType extends Node = Node> = (
    node: NodeType | { id: Node['id'] } | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;
  export type getConnectedEdges = (id: string | (Node | { id: Node['id'] })[]) => Edge[];
  export type getIncomers = (node: string | Node | { id: Node['id'] }) => Node[];
  export type getOutgoers = (node: string | Node | { id: Node['id'] }) => Node[];

  export type UpdateNode<NodeType extends Node = Node> = (
    id: string,
    nodeUpdate: Partial<NodeType> | ((node: NodeType) => Partial<NodeType>),
    options?: { replace: boolean }
  ) => void;
  export type UpdateNodeData<NodeType extends Node = Node> = (
    id: string,
    dataUpdate: object | ((node: NodeType) => object),
    options?: { replace: boolean }
  ) => void;
}

export type ReactFlowInstance<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  getNodes: Instance.GetNodes<NodeType>;
  setNodes: Instance.SetNodes<NodeType>;
  addNodes: Instance.AddNodes<NodeType>;
  getNode: Instance.GetNode<NodeType>;
  getEdges: Instance.GetEdges<EdgeType>;
  setEdges: Instance.SetEdges<EdgeType>;
  addEdges: Instance.AddEdges<EdgeType>;
  getEdge: Instance.GetEdge<EdgeType>;
  toObject: Instance.ToObject<NodeType, EdgeType>;
  deleteElements: Instance.DeleteElements;
  getIntersectingNodes: Instance.GetIntersectingNodes<NodeType>;
  isNodeIntersecting: Instance.IsNodeIntersecting<NodeType>;
  updateNode: Instance.UpdateNode<NodeType>;
  updateNodeData: Instance.UpdateNodeData<NodeType>;
  viewportInitialized: boolean;
} & Omit<ViewportHelperFunctions, 'initialized'>;
