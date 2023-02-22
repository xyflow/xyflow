import { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';
import type { Edge, ReactFlowState } from '@reactflow/system';

export function getMouseHandler(
  id: string,
  getState: StoreApi<ReactFlowState>['getState'],
  handler?: (event: ReactMouseEvent<SVGGElement, MouseEvent>, edge: Edge) => void
) {
  return handler === undefined
    ? handler
    : (event: ReactMouseEvent<SVGGElement, MouseEvent>) => {
        const edge = getState().edges.find((e) => e.id === id);

        if (edge) {
          handler(event, { ...edge });
        }
      };
}
