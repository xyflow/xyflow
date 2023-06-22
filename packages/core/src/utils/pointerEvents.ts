import { PointerEvent } from 'react';

type PointerTarget =
  | Pick<HTMLElement, 'hasPointerCapture' | 'releasePointerCapture'>
  | Pick<SVGElement, 'hasPointerCapture' | 'releasePointerCapture'>;

export const onPointerDownDisableCapture = (event: PointerEvent<PointerTarget>) => {
  const pointerTarget = event.target as unknown as PointerTarget;

  if ('hasPointerCapture' in pointerTarget && 'releasePointerCapture' in pointerTarget) {
    if (pointerTarget.hasPointerCapture(event.pointerId)) {
      pointerTarget.releasePointerCapture(event.pointerId);
    }
  }
};
