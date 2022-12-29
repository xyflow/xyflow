import type { Selection as D3Selection } from 'd3';
import { Node, Edge, Connection, EdgeMarkerType, Transform, XYPosition, Rect, NodeInternals, NodeOrigin } from '../types';
export declare const isEdge: (element: Node | Connection | Edge) => element is Edge<any>;
export declare const isNode: (element: Node | Connection | Edge) => element is Node<any>;
export declare const getOutgoers: <T = any, U extends T = T>(node: Node<U>, nodes: Node<T>[], edges: Edge[]) => Node<T>[];
export declare const getIncomers: <T = any, U extends T = T>(node: Node<U>, nodes: Node<T>[], edges: Edge[]) => Node<T>[];
export declare const getMarkerId: (marker: EdgeMarkerType | undefined, rfId?: string) => string;
export declare const addEdge: (edgeParams: Edge | Connection, edges: Edge[]) => Edge[];
export declare const updateEdge: (oldEdge: Edge, newConnection: Connection, edges: Edge[]) => Edge[];
export declare const pointToRendererPoint: ({ x, y }: XYPosition, [tx, ty, tScale]: Transform, snapToGrid: boolean, [snapX, snapY]: [number, number]) => XYPosition;
export declare const getNodePositionWithOrigin: (node: Node | undefined, nodeOrigin?: NodeOrigin) => XYPosition & {
    positionAbsolute: XYPosition;
};
export declare const getRectOfNodes: (nodes: Node[], nodeOrigin?: NodeOrigin) => Rect;
export declare const getNodesInside: (nodeInternals: NodeInternals, rect: Rect, [tx, ty, tScale]?: Transform, partially?: boolean, excludeNonSelectableNodes?: boolean, nodeOrigin?: NodeOrigin) => Node[];
export declare const getConnectedEdges: (nodes: Node[], edges: Edge[]) => Edge[];
export declare const getTransformForBounds: (bounds: Rect, width: number, height: number, minZoom: number, maxZoom: number, padding?: number) => Transform;
export declare const getD3Transition: (selection: D3Selection<Element, unknown, null, undefined>, duration?: number) => import("d3").Transition<Element, unknown, null, undefined>;
//# sourceMappingURL=graph.d.ts.map