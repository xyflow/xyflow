import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Set position of the panel
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  position?: PanelPosition;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => (s.userSelectionActive ? 'none' : 'all');

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ position = 'top-left', children, className, style, ...rest }, ref) => {
    const pointerEvents = useStore(selector);
    const positionClasses = `${position}`.split('-');

    return (
      <div
        className={cc(['react-flow__panel', className, ...positionClasses])}
        style={{ ...style, pointerEvents }}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel'
