/* eslint-disable @typescript-eslint/no-namespace */
import type { HandleConnection, HandleType, NodeConnection, Rect, Viewport } from '@xyflow/system';
import type { Node, Edge, ViewportHelperFunctions, InternalNode } from '.';

export type ReactFlowJsonObject<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes: NodeType[];
  edges: EdgeType[];
  viewport: Viewport;
};

export type DeleteElementsOptions = {
  nodes?: (Node | { id: Node['id'] })[];
  edges?: (Edge | { id: Edge['id'] })[];
};

/**
 * @inline
 */
export type GeneralHelpers<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  /**
   * Returns nodes.
   *
   * @returns nodes array
   */
  getNodes: () => NodeType[];
  /**
   * Sets nodes.
   *
   * @param payload - the nodes to set or a function that receives the current nodes and returns the new nodes
   */
  setNodes: (payload: NodeType[] | ((nodes: NodeType[]) => NodeType[])) => void;
  /**
   * Adds nodes.
   *
   * @param payload - the nodes to add
   */
  addNodes: (payload: NodeType[] | NodeType) => void;
  /**
   * Returns a node by id.
   *
   * @param id - the node id
   * @returns the node or undefined if no node was found
   */
  getNode: (id: string) => NodeType | undefined;
  /**
   * Returns an internal node by id.
   *
   * @param id - the node id
   * @returns the internal node or undefined if no node was found
   */
  getInternalNode: (id: string) => InternalNode<NodeType> | undefined;
  /**
   * Returns edges.
   *
   * @returns edges array
   */
  getEdges: () => EdgeType[];
  /**
   * Sets edges.
   *
   * @param payload - the edges to set or a function that receives the current edges and returns the new edges
   */
  setEdges: (payload: EdgeType[] | ((edges: EdgeType[]) => EdgeType[])) => void;
  /**
   * Adds edges.
   *
   * @param payload - the edges to add
   */
  addEdges: (payload: EdgeType[] | EdgeType) => void;
  /**
   * Returns an edge by id.
   *
   * @param id - the edge id
   * @returns the edge or undefined if no edge was found
   */
  getEdge: (id: string) => EdgeType | undefined;
  /**
   * Returns the nodes, edges and the viewport as a JSON object.
   *
   * @returns the nodes, edges and the viewport as a JSON object
   */
  toObject: () => ReactFlowJsonObject<NodeType, EdgeType>;
  /**
   * Deletes nodes and edges.
   *
   * @param params.nodes - optional nodes array to delete
   * @param params.edges - optional edges array to delete
   *
   * @returns a promise that resolves with the deleted nodes and edges
   */
  deleteElements: (params: DeleteElementsOptions) => Promise<{
    deletedNodes: Node[];
    deletedEdges: Edge[];
  }>;
  /**
   * Returns all nodes that intersect with the given node or rect.
   *
   * @param node - the node or rect to check for intersections
   * @param partially - if true, the node is considered to be intersecting if it partially overlaps with the passed node or rect
   * @param nodes - optional nodes array to check for intersections
   *
   * @returns an array of intersecting nodes
   */
  getIntersectingNodes: (
    node: NodeType | { id: Node['id'] } | Rect,
    partially?: boolean,
    nodes?: NodeType[]
  ) => NodeType[];
  /**
   * Checks if the given node or rect intersects with the passed rect.
   *
   * @param node - the node or rect to check for intersections
   * @param area - the rect to check for intersections
   * @param partially - if true, the node is considered to be intersecting if it partially overlaps with the passed react
   *
   * @returns true if the node or rect intersects with the given area
   */
  isNodeIntersecting: (node: NodeType | { id: Node['id'] } | Rect, area: Rect, partially?: boolean) => boolean;
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
  updateNode: (
    id: string,
    nodeUpdate: Partial<NodeType> | ((node: NodeType) => Partial<NodeType>),
    options?: { replace: boolean }
  ) => void;
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
  updateNodeData: (
    id: string,
    dataUpdate: Partial<NodeType['data']> | ((node: NodeType) => Partial<NodeType['data']>),
    options?: { replace: boolean }
  ) => void;
  /**
   * Updates an edge.
   *
   * @param id - id of the edge to update
   * @param edgeUpdate - the edge update as an object or a function that receives the current edge and returns the edge update
   * @param options.replace - if true, the edge is replaced with the edge update, otherwise the changes get merged
   *
   * @example
   * updateEdge('edge-1', (edge) => ({ label: 'A new label' }));
   */
  updateEdge: (
    id: string,
    edgeUpdate: Partial<EdgeType> | ((edge: EdgeType) => Partial<EdgeType>),
    options?: { replace: boolean }
  ) => void;
  /**
   * Updates the data attribute of a edge.
   *
   * @param id - id of the edge to update
   * @param dataUpdate - the data update as an object or a function that receives the current data and returns the data update
   * @param options.replace - if true, the data is replaced with the data update, otherwise the changes get merged
   *
   * @example
   * updateEdgeData('edge-1', { label: 'A new label' });
   */
  updateEdgeData: (
    id: string,
    dataUpdate: Partial<EdgeType['data']> | ((edge: EdgeType) => Partial<EdgeType['data']>),
    options?: { replace: boolean }
  ) => void;
  /**
   * Returns the bounds of the given nodes or node ids.
   *
   * @param nodes - the nodes or node ids to calculate the bounds for
   *
   * @returns the bounds of the given nodes
   */
  getNodesBounds: (nodes: (NodeType | InternalNode | string)[]) => Rect;
  /**
   * Gets all connections for a given handle belonging to a specific node.
   * @deprecated
   * @param type - handle type 'source' or 'target'
   * @param id - the handle id (this is only needed if you have multiple handles of the same type, meaning you have to provide a unique id for each handle)
   * @param nodeId - the node id the handle belongs to
   * @returns an array with handle connections
   */
  getHandleConnections: ({
    type,
    id,
    nodeId,
  }: {
    type: HandleType;
    nodeId: string;
    id?: string | null;
  }) => HandleConnection[];
  /**
   * Gets all connections to a node. Can be filtered by handle type and id.
   * @deprecated use `getNodeConnections` instead
   * @param type - handle type 'source' or 'target'
   * @param handleId - the handle id (this is only needed if you have multiple handles of the same type, meaning you have to provide a unique id for each handle)
   * @param nodeId - the node id the handle belongs to
   * @returns an array with handle connections
   */
  getNodeConnections: ({
    type,
    handleId,
    nodeId,
  }: {
    type?: HandleType;
    nodeId: string;
    handleId?: string | null;
  }) => NodeConnection[];
};

/**
 * The `ReactFlowInstance` provides a collection of methods to query and manipulate
 * the internal state of your flow. You can get an instance by using the
 * [`useReactFlow`](/api-reference/hooks/use-react-flow) hook or attaching a listener
 * to the [`onInit`](/api-reference/react-flow#event-oninit) event.
 *
 * @public
 */
export type ReactFlowInstance<NodeType extends Node = Node, EdgeType extends Edge = Edge> = GeneralHelpers<
  NodeType,
  EdgeType
> &
  Omit<ViewportHelperFunctions, 'initialized'> & {
    viewportInitialized: boolean;
  };
