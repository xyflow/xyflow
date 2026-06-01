import type { D3ZoomEvent } from 'd3-zoom';

/**
 * DOM events passed to d3-zoom filter and custom wheel handlers.
 */
export type D3ZoomInputEvent = WheelEvent | MouseEvent | TouchEvent;

export type XYFlowZoomEvent<ElementType extends Element> = Omit<D3ZoomEvent<ElementType, unknown>, 'sourceEvent'> & {
  sourceEvent: D3ZoomInputEvent;
};

/**
 * Flags attached to programmatic pan/zoom updates (not part of the DOM spec).
 */
export type XYFlowSourceEvent = D3ZoomInputEvent & {
  internal?: boolean;
  sync?: boolean;
};

export function isPointerEvent(event: Event): event is MouseEvent | TouchEvent {
  return event instanceof MouseEvent || event instanceof TouchEvent;
}

export function isWheelEvent(event: Event): event is WheelEvent {
  return event instanceof WheelEvent;
}

export function isTouchEvent(event: Event): event is TouchEvent {
  return event instanceof TouchEvent;
}

export function isMouseEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

export function getTouchPoint(event: MouseEvent | TouchEvent): [number, number] {
  if (isTouchEvent(event)) {
    const touch = event.touches[0] ?? event.changedTouches[0];

    return [touch?.clientX ?? 0, touch?.clientY ?? 0];
  }

  return [event.clientX, event.clientY];
}
