import React, { ReactNode } from 'react';

import { useStore } from '../../store';
import { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.transform;

type ViewportProps = {
  children: ReactNode;
};

function Viewport({ children }: ViewportProps) {
  const transform = useStore(selector);

  return (
    <div
      className="react-flow__viewport react-flow__container"
      style={{ transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})` }}
    >
      {children}
    </div>
  );
}

export default Viewport;
