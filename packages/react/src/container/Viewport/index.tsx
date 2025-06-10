import type { ReactNode } from 'react';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.transform;

type ViewportProps = {
  children: ReactNode;
};

export function Viewport({ children }: ViewportProps) {
  const transform = useStore(selector);

  return (
    <div
      className="react-flow__viewport xyflow__viewport react-flow__container"
      style={
        {
          '--xy-view-x': `${transform[0]}px`,
          '--xy-view-y': `${transform[1]}px`,
          '--xy-view-zoom': transform[2],
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
