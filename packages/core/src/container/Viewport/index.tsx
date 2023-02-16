import type { ReactNode } from 'react';
import type { ReactFlowState } from '@reactflow/system';

import { useStore } from '../../hooks/useStore';

const selector = (s: ReactFlowState) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;

type ViewportProps = {
  children: ReactNode;
};

function Viewport({ children }: ViewportProps) {
  const transform = useStore(selector);

  return (
    <div className="react-flow__viewport react-flow__container" style={{ transform }}>
      {children}
    </div>
  );
}

export default Viewport;
