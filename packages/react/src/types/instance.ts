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
  export type DeleteElements = (params: DeleteElementsOptions) => Promise<{
    deletedNodes: Node[];
    deletedEdges: Edge[];
  }>;
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
  /**
   * Returns nodes.
   *
   * @returns nodes array
   */
  getNodes: Instance.GetNodes<NodeType>;
  /**
   * Sets nodes.
   *
   * @param payload - the nodes to set or a function that receives the current nodes and returns the new nodes
   */
  setNodes: Instance.SetNodes<NodeType>;
  /**
   * Adds nodes.
   *
   * @param payload - the nodes to add
   */
  addNodes: Instance.AddNodes<NodeType>;
  /**
   * Returns a node by id.
   *
   * @param id - the node id
   * @returns the node or undefined if no node was found
   */
  getNode: Instance.GetNode<NodeType>;
  /**
   * Returns edges.
   *
   * @returns edges array
   */
  getEdges: Instance.GetEdges<EdgeType>;
  /**
   * Sets edges.
   *
   * @param payload - the edges to set or a function that receives the current edges and returns the new edges
   */
  setEdges: Instance.SetEdges<EdgeType>;
  /**
   * Adds edges.
   *
   * @param payload - the edges to add
   */
  addEdges: Instance.AddEdges<EdgeType>;
  /**
   * Returns an edge by id.
   *
   * @param id - the edge id
   * @returns the edge or undefined if no edge was found
   */
  getEdge: Instance.GetEdge<EdgeType>;
  /**
   * Returns the nodes, edges and the viewport as a JSON object.
   *
   * @returns the nodes, edges and the viewport as a JSON object
   */
  toObject: Instance.ToObject<NodeType, EdgeType>;
  /**
   * Deletes nodes and edges.
   *
   * @param params.nodes - optional nodes array to delete
   * @param params.edges - optional edges array to delete
   *
   * @returns a promise that resolves with the deleted nodes and edges
   */
  deleteElements: Instance.DeleteElements;
  /**
   * Returns all nodes that intersect with the given node or rect.
   *
   * @param node - the node or rect to check for intersections
   * @param partially - if true, the node is considered to be intersecting if it partially overlaps with the passed node or rect
   * @param nodes - optional nodes array to check for intersections
   *
   * @returns an array of intersecting nodes
   */
  getIntersectingNodes: Instance.GetIntersectingNodes<NodeType>;
  /**
   * Checks if the given node or rect intersects with the passed rect.
   *
   * @param node - the node or rect to check for intersections
   * @param area - the rect to check for intersections
   * @param partially - if true, the node is considered to be intersecting if it partially overlaps with the passed react
   *
   * @returns true if the node or rect intersects with the given area
   */
  isNodeIntersecting: Instance.IsNodeIntersecting<NodeType>;
  /**
   * Updates a node.
   *
   * @param id - id of the node to update
   * @param nodeUpdate - the node update as an object or a function that receives the current node and returns the node update
   * @param options.replace - if true, the node is replaced with the node update, otherwise the changes get merged
   *
   * @example
   * updateNode('node-1', (node) => ({ position: { x: node.position.x + 10, y: node.position.y } }));
   */
  updateNode: Instance.UpdateNode<NodeType>;
  /**
   * Updates the data attribute of a node.
   *
   * @param id - id of the node to update
   * @param dataUpdate - the data update as an object or a function that receives the current data and returns the data update
   * @param options.replace - if true, the data is replaced with the data update, otherwise the changes get merged
   *
   * @example
   * updateNodeData('node-1', { label: 'A new label' });
   */
  updateNodeData: Instance.UpdateNodeData<NodeType>;
  viewportInitialized: boolean;
} & Omit<ViewportHelperFunctions, 'initialized'>;
