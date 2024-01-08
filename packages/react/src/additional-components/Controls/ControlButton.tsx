import cc from 'classcat';

import type { ControlButtonProps } from './types';

export function ControlButton({ children, className, ...rest }: ControlButtonProps) {
  return (
    <button type="button" className={cc(['react-flow__controls-button', className])} {...rest}>
      {children}
    </button>
  );
}
