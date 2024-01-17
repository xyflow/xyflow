import type { HTMLAttributes, ReactNode } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /** Set position of the panel
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  position?: PanelPosition;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => (s.userSelectionActive ? 'none' : 'all');

export function Panel({ position = 'top-left', children, className, style, ...rest }: PanelProps) {
  const pointerEvents = useStore(selector);
  const positionClasses = `${position}`.split('-');

  return (
    <div
      className={cc(['react-flow__panel', className, ...positionClasses])}
      style={{ ...style, pointerEvents }}
      {...rest}
    >
      {children}
    </div>
  );
}
