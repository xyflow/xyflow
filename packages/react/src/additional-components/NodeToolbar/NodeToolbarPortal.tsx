import { type ReactNode, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import { useReactFlowStore } from '../../hooks/useReactFlowStore';

export function NodeToolbarPortal({ children }: { children: ReactNode }): ReactPortal | null {
  const domNode = useReactFlowStore((s) => s.domNode);

  const wrapperRef = domNode?.querySelector('.react-flow__renderer');

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}
