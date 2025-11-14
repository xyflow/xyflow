/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ZoomTransform, zoomIdentity } from 'd3-zoom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { transition } from 'd3-transition';

import { type D3SelectionInstance, type Viewport } from '../types';
import { isMacOs } from '../utils';

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

// taken from d3-ease: https://github.com/d3/d3-ease/blob/main/src/cubic.js
const defaultEase = (t: number) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;

export const getD3Transition = (selection: D3SelectionInstance, duration = 0, ease = defaultEase, onEnd = () => {}) => {
  const hasDuration = typeof duration === 'number' && duration > 0;

  if (!hasDuration) {
    onEnd();
  }

  return hasDuration ? selection.transition().duration(duration).ease(ease).on('end', onEnd) : selection;
};

export const wheelDelta = (event: any) => {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;

  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
};
