/// <reference types="react" />
import { Position } from '../../types';
import type { BezierEdgeProps } from '../../types';
export interface GetBezierPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
    curvature?: number;
}
export declare function getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature, }: GetBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];
declare const BezierEdge: import("react").MemoExoticComponent<({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, pathOptions, interactionWidth, }: BezierEdgeProps) => JSX.Element>;
export default BezierEdge;
//# sourceMappingURL=BezierEdge.d.ts.map