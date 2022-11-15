import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../hooks/useStore';
import { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.domNode?.querySelector('.react-flow__edgelabel-renderer');

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const edgeLabelRenderer = useStore(selector);

  if (!edgeLabelRenderer) {
    return null;
  }

  return createPortal(children, edgeLabelRenderer);
}

export default EdgeLabelRenderer;
