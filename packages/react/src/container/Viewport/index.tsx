import type { ReactNode } from 'react';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';
import { Viewport } from '@xyflow/system';

const selector = (s: ReactFlowState) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;

type ViewportProps = {
  children: ReactNode;
  viewport?: Viewport;
};

function ControlledViewport({ children, viewport }: Required<ViewportProps>) {
  return (
    <div
      className="react-flow__viewport xyflow__viewport react-flow__container"
      style={{ transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})` }}
    >
      {children}
    </div>
  );
}

function UncontrolledViewport({ children }: Pick<ViewportProps, 'children'>) {
  const transform = useStore(selector);

  return (
    <div className="react-flow__viewport xyflow__viewport react-flow__container" style={{ transform }}>
      {children}
    </div>
  );
}

function ViewportWrapper({ children, viewport }: ViewportProps) {
  if (viewport) {
    return <ControlledViewport viewport={viewport}>{children}</ControlledViewport>;
  }

  return <UncontrolledViewport>{children}</UncontrolledViewport>;
}

export default ViewportWrapper;
