import type { MouseEvent as ReactMouseEvent } from 'react';
import type { Edge, ReactFlowStoreApi } from '../../types';

export function getMouseHandler(
  id: string,
  getState: ReactFlowStoreApi['getState'],
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
