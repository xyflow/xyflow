import { useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStoreApi } from '../../hooks/useStore';
import { getEdgeLabelRendererId } from '../../utils/graph';

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const store = useStoreApi()
  const state = store.getState()
  const wrapperRef = useRef(document.getElementById(getEdgeLabelRendererId(state.rfId)));

  if (!wrapperRef.current) {
    return null;
  }

  return createPortal(children, wrapperRef.current);
}

export default EdgeLabelRenderer;
