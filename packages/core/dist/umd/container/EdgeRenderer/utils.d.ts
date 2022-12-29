import { Position } from '../../types';
import type { EdgeTypes, EdgeTypesWrapped, HandleElement, NodeHandleBounds, Node, Rect, Transform, XYPosition } from '../../types';
export declare type CreateEdgeTypes = (edgeTypes: EdgeTypes) => EdgeTypesWrapped;
export declare function createEdgeTypes(edgeTypes: EdgeTypes): EdgeTypesWrapped;
export declare function getHandlePosition(position: Position, nodeRect: Rect, handle?: HandleElement | null): XYPosition;
export declare function getHandle(bounds: HandleElement[], handleId: string | null): HandleElement | null;
interface EdgePositions {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}
export declare const getEdgePositions: (sourceNodeRect: Rect, sourceHandle: HandleElement, sourcePosition: Position, targetNodeRect: Rect, targetHandle: HandleElement, targetPosition: Position) => EdgePositions;
interface IsEdgeVisibleParams {
    sourcePos: XYPosition;
    targetPos: XYPosition;
    sourceWidth: number;
    sourceHeight: number;
    targetWidth: number;
    targetHeight: number;
    width: number;
    height: number;
    transform: Transform;
}
export declare function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform, }: IsEdgeVisibleParams): boolean;
export declare function getNodeData(node: Node): [Rect, NodeHandleBounds | null, boolean];
export {};
//# sourceMappingURL=utils.d.ts.map