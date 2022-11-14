import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../hooks/useStore';
import { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  d3Selection: s.d3Selection,
});

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const { d3Selection } = useStore(selector);

  const edgeLabelRendererElement = d3Selection?.select('.react-flow__edgelabel-renderer').node();

  if (!edgeLabelRendererElement || !(edgeLabelRendererElement instanceof HTMLDivElement)) {
    return null;
  }

  return createPortal(children, edgeLabelRendererElement);
}

export default EdgeLabelRenderer;
