/// <reference types="react" />
import { Position } from '../../types';
import type { SmoothStepEdgeProps } from '../../types';
export interface GetSmoothStepPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
    borderRadius?: number;
    centerX?: number;
    centerY?: number;
    offset?: number;
}
export declare function getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius, centerX, centerY, offset, }: GetSmoothStepPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];
declare const SmoothStepEdge: import("react").MemoExoticComponent<({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, sourcePosition, targetPosition, markerEnd, markerStart, pathOptions, interactionWidth, }: SmoothStepEdgeProps) => JSX.Element>;
export default SmoothStepEdge;
//# sourceMappingURL=SmoothStepEdge.d.ts.map