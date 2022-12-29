/// <reference types="react" />
import { Position } from '../../types';
import type { EdgeProps } from '../../types';
export interface GetSimpleBezierPathParams {
    sourceX: number;
    sourceY: number;
    sourcePosition?: Position;
    targetX: number;
    targetY: number;
    targetPosition?: Position;
}
export declare function getSimpleBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, }: GetSimpleBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];
declare const SimpleBezierEdge: import("react").MemoExoticComponent<({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }: EdgeProps) => JSX.Element>;
export default SimpleBezierEdge;
//# sourceMappingURL=SimpleBezierEdge.d.ts.map