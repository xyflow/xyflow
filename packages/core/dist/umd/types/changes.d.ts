import type { XYPosition, Dimensions } from './utils';
import type { Node } from './nodes';
import type { Edge } from './edges';
export declare type NodeDimensionChange = {
    id: string;
    type: 'dimensions';
    dimensions?: Dimensions;
    updateStyle?: boolean;
    resizing?: boolean;
};
export declare type NodePositionChange = {
    id: string;
    type: 'position';
    position?: XYPosition;
    positionAbsolute?: XYPosition;
    dragging?: boolean;
};
export declare type NodeSelectionChange = {
    id: string;
    type: 'select';
    selected: boolean;
};
export declare type NodeRemoveChange = {
    id: string;
    type: 'remove';
};
export declare type NodeAddChange<NodeData = any> = {
    item: Node<NodeData>;
    type: 'add';
};
export declare type NodeResetChange<NodeData = any> = {
    item: Node<NodeData>;
    type: 'reset';
};
export declare type NodeChange = NodeDimensionChange | NodePositionChange | NodeSelectionChange | NodeRemoveChange | NodeAddChange | NodeResetChange;
export declare type EdgeSelectionChange = NodeSelectionChange;
export declare type EdgeRemoveChange = NodeRemoveChange;
export declare type EdgeAddChange<EdgeData = any> = {
    item: Edge<EdgeData>;
    type: 'add';
};
export declare type EdgeResetChange<EdgeData = any> = {
    item: Edge<EdgeData>;
    type: 'reset';
};
export declare type EdgeChange = EdgeSelectionChange | EdgeRemoveChange | EdgeAddChange | EdgeResetChange;
//# sourceMappingURL=changes.d.ts.map