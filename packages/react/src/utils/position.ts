export function rotatePoint(x: number, y: number, cx: number, cy: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  // Translate point to origin
  const dx = x - cx;
  const dy = y - cy;

  // Rotate point
  const newX = dx * cos - dy * sin;
  const newY = dx * sin + dy * cos;

  // Translate point back
  return { x: newX + cx, y: newY + cy };
}