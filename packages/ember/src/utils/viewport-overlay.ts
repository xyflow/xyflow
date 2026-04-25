type AlignX = 'left' | 'center' | 'right';
type AlignY = 'top' | 'center' | 'bottom';

const alignXToPercent: Record<AlignX, number> = {
  left: 0,
  center: 50,
  right: 100,
};

const alignYToPercent: Record<AlignY, number> = {
  top: 0,
  center: 50,
  bottom: 100,
};

export interface ViewportOverlayTransformOptions {
  x: number;
  y: number;
  zoom: number;
  offsetX?: number;
  offsetY?: number;
  alignX?: AlignX;
  alignY?: AlignY;
}

export function getViewportOverlayTransform({
  x,
  y,
  zoom,
  offsetX = 0,
  offsetY = 0,
  alignX = 'center',
  alignY = 'center',
}: ViewportOverlayTransformOptions) {
  return [
    `translate(${x}px, ${y}px)`,
    `scale(${1 / zoom})`,
    `translate(${offsetX}px, ${offsetY}px)`,
    `translate(${-(alignXToPercent[alignX] ?? 50)}%, ${-(alignYToPercent[alignY] ?? 50)}%)`,
  ].join(' ');
}
