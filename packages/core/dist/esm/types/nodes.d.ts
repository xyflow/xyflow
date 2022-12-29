import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import { internalsSymbol } from '../utils';
import type { XYPosition, Position, CoordinateExtent, HandleElement } from '.';
export declare type Node<T = any> = {
    id: string;
    position: XYPosition;
    data: T;
    type?: string;
    style?: CSSProperties;
    className?: string;
    sourcePosition?: Position;
    targetPosition?: Position;
    hidden?: boolean;
    selected?: boolean;
    dragging?: boolean;
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    deletable?: boolean;
    dragHandle?: string;
    width?: number | null;
    height?: number | null;
    parentNode?: string;
    zIndex?: number;
    extent?: 'parent' | CoordinateExtent;
    expandParent?: boolean;
    positionAbsolute?: XYPosition;
    ariaLabel?: string;
    focusable?: boolean;
    resizing?: boolean;
    [internalsSymbol]?: {
        z?: number;
        handleBounds?: NodeHandleBounds;
        isParent?: boolean;
    };
};
export declare type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;
export declare type NodeDragHandler = (event: ReactMouseEvent, node: Node, nodes: Node[]) => void;
export declare type SelectionDragHandler = (event: ReactMouseEvent, nodes: Node[]) => void;
export declare type WrapNodeProps<T = any> = Pick<Node<T>, 'id' | 'data' | 'style' | 'className' | 'dragHandle' | 'sourcePosition' | 'targetPosition' | 'hidden' | 'ariaLabel'> & Required<Pick<Node<T>, 'selected' | 'type' | 'zIndex'>> & {
    isConnectable: boolean;
    xPos: number;
    yPos: number;
    xPosOrigin: number;
    yPosOrigin: number;
    initialized: boolean;
    isSelectable: boolean;
    isDraggable: boolean;
    isFocusable: boolean;
    selectNodesOnDrag: boolean;
    onClick?: NodeMouseHandler;
    onDoubleClick?: NodeMouseHandler;
    onMouseEnter?: NodeMouseHandler;
    onMouseMove?: NodeMouseHandler;
    onMouseLeave?: NodeMouseHandler;
    onContextMenu?: NodeMouseHandler;
    resizeObserver: ResizeObserver | null;
    isParent: boolean;
    noDragClassName: string;
    noPanClassName: string;
    rfId: string;
    disableKeyboardA11y: boolean;
};
export declare type NodeProps<T = any> = Pick<WrapNodeProps<T>, 'id' | 'data' | 'dragHandle' | 'type' | 'selected' | 'isConnectable' | 'xPos' | 'yPos' | 'zIndex'> & {
    dragging: boolean;
    targetPosition?: Position;
    sourcePosition?: Position;
};
export declare type NodeHandleBounds = {
    source: HandleElement[] | null;
    target: HandleElement[] | null;
};
export declare type NodeDimensionUpdate = {
    id: string;
    nodeElement: HTMLDivElement;
    forceUpdate?: boolean;
};
export declare type NodeInternals = Map<string, Node>;
export declare type NodeBounds = XYPosition & {
    width: number | null;
    height: number | null;
};
export declare type NodeDragItem = {
    id: string;
    position: XYPosition;
    positionAbsolute: XYPosition;
    distance: XYPosition;
    width?: number | null;
    height?: number | null;
    extent?: 'parent' | CoordinateExtent;
    parentNode?: string;
    dragging?: boolean;
};
export declare type NodeOrigin = [number, number];
//# sourceMappingURL=nodes.d.ts.map