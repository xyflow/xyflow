export function getEdgeToolbarTransform(
  x: number,
  y: number,
  zoom: number,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  // Position the toolbar at the edge label center (scaling is handled by EdgeLabelRenderer)
  return `translate(${x + offsetX}px, ${y + offsetY}px) translate(-50%, -50%) scale(${1 / zoom})`;
}
