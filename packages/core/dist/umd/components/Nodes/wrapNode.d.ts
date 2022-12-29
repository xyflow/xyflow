import type { ComponentType } from 'react';
import type { NodeProps, WrapNodeProps, XYPosition } from '../../types';
export declare const arrowKeyDiffs: Record<string, XYPosition>;
declare const _default: (NodeComponent: ComponentType<NodeProps>) => import("react").MemoExoticComponent<{
    ({ id, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId, }: WrapNodeProps): JSX.Element | null;
    displayName: string;
}>;
export default _default;
//# sourceMappingURL=wrapNode.d.ts.map