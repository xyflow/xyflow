import { CSSProperties, SVGAttributes } from 'react';
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
}
export interface Edge {
    id: ElementId;
    type?: string;
    source: ElementId;
    target: ElementId;
    style?: SVGAttributes<{}>;
    animated?: boolean;
}
export interface EdgeProps {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    style?: SVGAttributes<{}>;
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
    onClick?: (edge: Edge) => void;
    animated?: boolean;
    selected?: boolean;
}
export {};
