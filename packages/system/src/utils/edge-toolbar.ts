import { type Viewport } from '..';

export function getEdgeToolbarTransform(
  labelX: number,
  labelY: number,
  viewport: Viewport,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  // Position the toolbar at the edge label center (scaling is handled by EdgeLabelRenderer)
  return `translate(${labelX + offsetX}px, ${labelY + offsetY}px) translate(-50%, -50%) scale(${1 / viewport.zoom})`;
}
