import { Position, type Viewport, type Align } from '..';

export function getEdgeToolbarTransform(labelX: number, labelY: number, viewport: Viewport): string {
  // Position the toolbar at the edge label center (scaling is handled by EdgeLabelRenderer)
  return `translate(${labelX}px, ${labelY}px)`;
}
