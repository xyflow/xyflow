import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ReactFlowState, useStore } from '@reactflow/core';

function NodeToolbarPortal({ children }: { children: ReactNode }) {
  const wrapperRef = useStore((state: ReactFlowState) => state.domNode?.querySelector('.react-flow__pane'));

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}

export default NodeToolbarPortal;
