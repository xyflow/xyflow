import { type ZoomTransform, zoomIdentity } from 'd3-zoom';

import { type D3SelectionInstance, type Viewport } from '../types';
import { isMacOs } from '../utils';

export const viewChanged = (prevViewport: Viewport, eventViewport: any): boolean =>
  prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;

export const transformToViewport = (transform: ZoomTransform): Viewport => ({
  x: transform.x,
  y: transform.y,
  zoom: transform.k,
});

export const viewportToTransform = ({ x, y, zoom }: Viewport): ZoomTransform =>
  zoomIdentity.translate(x, y).scale(zoom);

export const isWrappedWithClass = (event: any, className: string | undefined) => event.target.closest(`.${className}`);

export const isRightClickPan = (panOnDrag: boolean | number[], usedButton: number) =>
  usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);

export const getD3Transition = (selection: D3SelectionInstance, duration = 0) =>
  typeof duration === 'number' && duration > 0 ? selection.transition().duration(duration) : selection;

export const wheelDelta = (event: any) => {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;

  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
};
