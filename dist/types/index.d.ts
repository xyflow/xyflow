import { CSSProperties } from 'react';
export declare type ElementId = string;
export declare type Elements = Array<Node | Edge>;
export declare type Transform = [number, number, number];
export declare enum Position {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom"
}
export declare type XYPosition = {
    x: number;
    y: number;
};
export declare enum GridType {
    Lines = "lines",
    Dots = "dots"
}
export declare type HandleType = 'source' | 'target';
export declare type NodeTypesType = {
    [key: string]: React.ReactNode;
};
export declare type EdgeTypesType = NodeTypesType;
export interface Dimensions {
    width: number;
    height: number;
}
export interface Rect extends Dimensions, XYPosition {
}
export interface Box extends XYPosition {
    x2: number;
    y2: number;
}
export interface SelectionRect extends Rect {
    startX: number;
    startY: number;
    draw: boolean;
}
export interface Node {
    id: ElementId;
    position: XYPosition;
    type?: string;
    __rg?: any;
    data?: any;
    style?: CSSProperties;
    targetPosition?: Position;
    sourcePosition?: Position;
}
export interface Edge {
    id: ElementId;
    type?: string;
    source: ElementId;
    target: ElementId;
    label?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    style?: CSSProperties;
    animated?: boolean;
}
export interface EdgeProps {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    label?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    style?: CSSProperties;
}
export interface EdgeBezierProps extends EdgeProps {
    sourcePosition: Position;
    targetPosition: Position;
}
export interface NodeProps {
    id: ElementId;
    type: string;
    data: any;
    selected: boolean;
    targetPosition?: Position;
    sourcePosition?: Position;
    style?: CSSProperties;
}
export interface NodeComponentProps {
    id: ElementId;
    type: string;
    data: any;
    selected?: boolean;
    transform?: Transform;
    xPos?: number;
    yPos?: number;
    targetPosition?: Position;
    sourcePosition?: Position;
    onClick?: (node: Node) => void | undefined;
    onNodeDragStop?: () => any;
    style?: CSSProperties;
}
export interface WrapNodeProps {
    id: ElementId;
    type: string;
    data: any;
    selected: boolean;
    transform: Transform;
    xPos: number;
    yPos: number;
    isInteractive: boolean;
    onClick: (node: Node) => void | undefined;
    onNodeDragStop: (node: Node) => void;
    style?: CSSProperties;
    sourcePosition?: Position;
    targetPosition?: Position;
}
export declare type FitViewParams = {
    padding: number;
};
export declare type FitViewFunc = (fitViewOptions: FitViewParams) => void;
declare type OnLoadParams = {
    zoomIn: () => void;
    zoomOut: () => void;
    fitView: FitViewFunc;
};
export declare type OnLoadFunc = (params: OnLoadParams) => void;
export declare type Connection = {
    source: ElementId | null;
    target: ElementId | null;
};
export declare type OnConnectFunc = (params: Connection) => void;
export interface HandleElement extends XYPosition, Dimensions {
    id?: ElementId | null;
    position: Position;
}
export interface EdgeCompProps {
    id: ElementId;
    source: ElementId;
    target: ElementId;
    type: any;
    label?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    onClick?: (edge: Edge) => void;
    animated?: boolean;
    selected?: boolean;
}
export interface EdgeTextProps {
    x: number;
    y: number;
    label?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
}
export {};
