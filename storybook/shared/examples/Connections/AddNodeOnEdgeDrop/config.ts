export function dropPosition(event: MouseEvent | TouchEvent) {
  const pointer = 'changedTouches' in event ? event.changedTouches[0] : event;
  return pointer ? { x: pointer.clientX, y: pointer.clientY } : null;
}
