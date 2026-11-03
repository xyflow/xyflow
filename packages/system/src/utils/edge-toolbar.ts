const alignXToPercent: Record<'left' | 'center' | 'right', number> = {
  left: 0,
  center: 50,
  right: 100,
};

const alignYToPercent: Record<'top' | 'center' | 'bottom', number> = {
  top: 0,
  center: 50,
  bottom: 100,
};

export function getEdgeToolbarTransform(
  x: number,
  y: number,
  zoom: number,
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' = 'center'
): string {
  return `translate(${x}px, ${y}px) scale(${1 / zoom}) translate(${-(alignXToPercent[alignX] ?? 50)}%, ${-(
    alignYToPercent[alignY] ?? 50
  )}%)`;
}
