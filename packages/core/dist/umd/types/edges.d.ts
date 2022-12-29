import type { CSSProperties, ComponentType, HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { Position } from '.';
import type { Connection, HandleElement, HandleType, Node } from '.';
declare type EdgeLabelOptions = {
    label?: string | ReactNode;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
};
declare type DefaultEdge<T = any> = {
    id: string;
    type?: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    style?: CSSProperties;
    animated?: boolean;
    hidden?: boolean;
    deletable?: boolean;
    data?: T;
    className?: string;
    sourceNode?: Node;
    targetNode?: Node;
    selected?: boolean;
    markerStart?: EdgeMarkerType;
    markerEnd?: EdgeMarkerType;
    zIndex?: number;
    ariaLabel?: string;
    interactionWidth?: number;
    focusable?: boolean;
} & EdgeLabelOptions;
export declare type SmoothStepPathOptions = {
    offset?: number;
    borderRadius?: number;
};
declare type SmoothStepEdgeType<T> = DefaultEdge<T> & {
    type: 'smoothstep';
    pathOptions?: SmoothStepPathOptions;
};
export declare type BezierPathOptions = {
    curvature?: number;
};
declare type BezierEdgeType<T> = DefaultEdge<T> & {
    type: 'default';
    pathOptions?: BezierPathOptions;
};
export declare type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T>;
export declare type DefaultEdgeOptions = Omit<Edge, 'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'sourceNode' | 'targetNode'>;
export declare type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;
export declare type WrapEdgeProps<T = any> = Omit<Edge<T>, 'sourceHandle' | 'targetHandle'> & {
    onClick?: EdgeMouseHandler;
    onEdgeDoubleClick?: EdgeMouseHandler;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: Position;
    targetPosition: Position;
    elementsSelectable?: boolean;
    onEdgeUpdate?: OnEdgeUpdateFunc;
    onContextMenu?: EdgeMouseHandler;
    onMouseEnter?: EdgeMouseHandler;
    onMouseMove?: EdgeMouseHandler;
    onMouseLeave?: EdgeMouseHandler;
    edgeUpdaterRadius?: number;
    onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge, handleType: HandleType) => void;
    onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge, handleType: HandleType) => void;
    rfId?: string;
    isFocusable: boolean;
    pathOptions?: BezierPathOptions | SmoothStepPathOptions;
};
export declare type EdgeProps<T = any> = Pick<Edge<T>, 'id' | 'animated' | 'data' | 'style' | 'selected' | 'source' | 'target'> & Pick<WrapEdgeProps, 'sourceX' | 'sourceY' | 'targetX' | 'targetY' | 'sourcePosition' | 'targetPosition' | 'sourceHandleId' | 'targetHandleId' | 'interactionWidth'> & EdgeLabelOptions & {
    markerStart?: string;
    markerEnd?: string;
    pathOptions?: any;
};
export declare type BaseEdgeProps = Pick<EdgeProps, 'style' | 'markerStart' | 'markerEnd' | 'interactionWidth'> & EdgeLabelOptions & {
    labelX?: number;
    labelY?: number;
    path: string;
};
export declare type SmoothStepEdgeProps<T = any> = EdgeProps<T> & {
    pathOptions?: SmoothStepPathOptions;
};
export declare type BezierEdgeProps<T = any> = EdgeProps<T> & {
    pathOptions?: BezierPathOptions;
};
export declare type EdgeTextProps = HTMLAttributes<SVGElement> & EdgeLabelOptions & {
    x: number;
    y: number;
};
export declare enum ConnectionLineType {
    Bezier = "default",
    Straight = "straight",
    Step = "step",
    SmoothStep = "smoothstep",
    SimpleBezier = "simplebezier"
}
export declare type ConnectionLineComponentProps = {
    connectionLineStyle?: CSSProperties;
    connectionLineType: ConnectionLineType;
    fromNode?: Node;
    fromHandle?: HandleElement;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    fromPosition: Position;
    toPosition: Position;
};
export declare type ConnectionLineComponent = ComponentType<ConnectionLineComponentProps>;
export declare type OnEdgeUpdateFunc<T = any> = (oldEdge: Edge<T>, newConnection: Connection) => void;
export declare type EdgeMarker = {
    type: MarkerType;
    color?: string;
    width?: number;
    height?: number;
    markerUnits?: string;
    orient?: string;
    strokeWidth?: number;
};
export declare type EdgeMarkerType = string | EdgeMarker;
export declare enum MarkerType {
    Arrow = "arrow",
    ArrowClosed = "arrowclosed"
}
export {};
//# sourceMappingURL=edges.d.ts.map