import { type ReactNode, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import type { ReactFlowState } from '../../types';
import { useReactFlowStore } from '../../hooks/useReactFlowStore';

const selector = (state: ReactFlowState) => state.domNode;

export function NodeToolbarPortal({ children }: { children: ReactNode }): ReactPortal | null {
  const domNode = useReactFlowStore(selector);

  const wrapperRef = domNode?.querySelector('.react-flow__renderer');

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}
