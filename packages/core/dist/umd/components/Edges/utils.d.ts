import { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';
import type { Edge, MarkerType, ReactFlowState } from '../../types';
export declare const getMarkerEnd: (markerType?: MarkerType, markerEndId?: string) => string;
export declare function getMouseHandler(id: string, getState: StoreApi<ReactFlowState>['getState'], handler?: (event: ReactMouseEvent<SVGGElement, MouseEvent>, edge: Edge) => void): ((event: ReactMouseEvent<SVGGElement, MouseEvent>) => void) | undefined;
export declare function getEdgeCenter({ sourceX, sourceY, targetX, targetY, }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}): [number, number, number, number];
export declare function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY, }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourceControlX: number;
    sourceControlY: number;
    targetControlX: number;
    targetControlY: number;
}): [number, number, number, number];
//# sourceMappingURL=utils.d.ts.map