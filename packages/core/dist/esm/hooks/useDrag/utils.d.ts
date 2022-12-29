import type { RefObject } from 'react';
import type { CoordinateExtent, Node, NodeDragItem, NodeInternals, NodeOrigin, XYPosition } from '../../types';
export declare function isParentSelected(node: Node, nodeInternals: NodeInternals): boolean;
export declare function hasSelector(target: Element, selector: string, nodeRef: RefObject<Element>): boolean;
export declare function getDragItems(nodeInternals: NodeInternals, mousePos: XYPosition, nodeId?: string): NodeDragItem[];
export declare function calcNextPosition(node: NodeDragItem | Node, nextPosition: XYPosition, nodeInternals: NodeInternals, nodeExtent?: CoordinateExtent, nodeOrigin?: NodeOrigin): {
    position: XYPosition;
    positionAbsolute: XYPosition;
};
export declare function getEventHandlerParams({ nodeId, dragItems, nodeInternals, }: {
    nodeId?: string;
    dragItems: NodeDragItem[];
    nodeInternals: NodeInternals;
}): [Node, Node[]];
//# sourceMappingURL=utils.d.ts.map