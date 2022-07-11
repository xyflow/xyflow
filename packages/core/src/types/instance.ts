import { ViewportHelperFunctions, Viewport } from './general';
import { Node } from './nodes';
import { Edge } from './edges';

export type ReactFlowJsonObject<NodeData = any, EdgeData = any> = {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  viewport: Viewport;
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
  viewportInitialized: boolean;
} & Omit<ViewportHelperFunctions, 'initialized'>;
