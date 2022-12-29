export declare enum Position {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom"
}
export interface XYPosition {
    x: number;
    y: number;
}
export declare type XYZPosition = XYPosition & {
    z: number;
};
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
export declare type Transform = [number, number, number];
export declare type CoordinateExtent = [[number, number], [number, number]];
//# sourceMappingURL=utils.d.ts.map