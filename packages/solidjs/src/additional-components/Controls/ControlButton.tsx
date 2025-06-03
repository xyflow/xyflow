import cc from 'classcat';

import type { ControlButtonProps } from './types';
import { splitProps } from 'solid-js';

export function ControlButton(p: ControlButtonProps) {
  // { children, className, ...rest }: ControlButtonProps) {
    const [_, rest] = splitProps(p, ['children', 'class']);

  return (
    <button type="button" class={cc(['react-flow__controls-button', p.class])} {...rest}>
      {p.children}
    </button>
  );
}
