import { useMemo, type ReactNode, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import type { ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';

const selector = (state: ReactFlowState) => state.domNode;

export function NodeToolbarPortal({ children }: { children: ReactNode }): ReactPortal | null {
  const domNode = useStore(selector);

  const wrapperRef = useMemo(() => domNode?.querySelector('.react-flow__renderer'), [domNode]);

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}
