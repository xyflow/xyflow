import { DraggableEvent } from 'react-draggable';
import { MouseEvent as ReactMouseEvent } from 'react';

export const isInputDOMNode = (e: ReactMouseEvent | DraggableEvent | KeyboardEvent) => {
  const target = e?.target as HTMLElement;

  return (
    ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target?.nodeName) || target?.hasAttribute('contenteditable')
  );
};

export const getDimensions = (node: HTMLDivElement) => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

export const clamp = (val: number, min: number = 0, max: number = 1): number => Math.min(Math.max(val, min), max);
