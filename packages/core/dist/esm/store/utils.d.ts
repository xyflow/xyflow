import type { StoreApi } from 'zustand';
import type { Edge, EdgeSelectionChange, Node, NodeInternals, NodeSelectionChange, ReactFlowState, FitViewOptions, NodeOrigin } from '../types';
export declare function createNodeInternals(nodes: Node[], nodeInternals: NodeInternals, nodeOrigin: NodeOrigin, elevateNodesOnSelect: boolean): NodeInternals;
declare type InternalFitViewOptions = {
    initial?: boolean;
} & FitViewOptions;
export declare function fitView(get: StoreApi<ReactFlowState>['getState'], options?: InternalFitViewOptions): boolean;
export declare function handleControlledNodeSelectionChange(nodeChanges: NodeSelectionChange[], nodeInternals: NodeInternals): Map<string, Node<any>>;
export declare function handleControlledEdgeSelectionChange(edgeChanges: EdgeSelectionChange[], edges: Edge[]): Edge<any>[];
declare type UpdateNodesAndEdgesParams = {
    changedNodes: NodeSelectionChange[] | null;
    changedEdges: EdgeSelectionChange[] | null;
    get: StoreApi<ReactFlowState>['getState'];
    set: StoreApi<ReactFlowState>['setState'];
};
export declare function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }: UpdateNodesAndEdgesParams): void;
export {};
//# sourceMappingURL=utils.d.ts.map