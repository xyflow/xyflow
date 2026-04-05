import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useStore } from '../../hooks/useStore';

export function NodeToolbarPortal({ children }: { children: ReactNode }) {
  const wrapperRef = useStore((state) => state.domNode?.querySelector('.react-flow__renderer'));

  if (!wrapperRef) {
    return null;
  }

  return createPortal(children, wrapperRef);
}
