import type { HTMLAttributes, ReactNode } from 'react';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import type { PanelPosition, ReactFlowState } from '../../types';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  position: PanelPosition;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => (s.userSelectionActive ? 'none' : 'all');

function Panel({ position, children, className, style, ...rest }: PanelProps) {
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

export default Panel;
