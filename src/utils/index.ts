import { DraggableEvent } from 'react-draggable';
import { MouseEvent as ReactMouseEvent } from 'react';

export const isInputDOMNode = (e: ReactMouseEvent | DraggableEvent | KeyboardEvent) => {
  const target = e.target as HTMLElement;
  return e && target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.nodeName);
};

export const getDimensions = (node: HTMLDivElement) => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});
