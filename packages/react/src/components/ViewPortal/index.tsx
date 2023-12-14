import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.domNode?.querySelector('.react-flow__view-portal');

function ViewPortal({ children }: { children: ReactNode }) {
  const viewPortalDiv = useStore(selector);

  if (!viewPortalDiv) {
    return null;
  }

  return createPortal(children, viewPortalDiv);
}

export default ViewPortal;
