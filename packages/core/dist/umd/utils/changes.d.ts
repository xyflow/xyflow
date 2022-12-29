import type { Node, Edge, EdgeChange, NodeChange } from '../types';
export declare function applyNodeChanges<NodeData = any>(changes: NodeChange[], nodes: Node<NodeData>[]): Node<NodeData>[];
export declare function applyEdgeChanges<EdgeData = any>(changes: EdgeChange[], edges: Edge<EdgeData>[]): Edge<EdgeData>[];
export declare const createSelectionChange: (id: string, selected: boolean) => {
    id: string;
    type: string;
    selected: boolean;
};
export declare function getSelectionChanges(items: any[], selectedIds: string[]): any;
//# sourceMappingURL=changes.d.ts.map