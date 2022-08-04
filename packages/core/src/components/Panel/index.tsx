import React, { HTMLAttributes, ReactNode } from 'react';
import cc from 'classcat';

import { PanelPosition } from '../../types';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  position: PanelPosition;
  children: ReactNode;
};

function Panel({ position, children, className, ...rest }: PanelProps) {
  const positionClasses = `${position}`.split('-');

  return (
    <div className={cc(['react-flow__panel', className, ...positionClasses])} {...rest}>
      {children}
    </div>
  );
}

export default Panel;
