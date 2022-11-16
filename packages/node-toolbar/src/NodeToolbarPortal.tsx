import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ReactFlowState, useStore } from '@reactflow/core';

const selector = (state: ReactFlowState) => state.domNode?.querySelector('.react-flow__renderer');

function NodeToolbarPortal({ children }: { children: ReactNode }) {
  const wrapperRef = useStore(selector);

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}

export default NodeToolbarPortal;
