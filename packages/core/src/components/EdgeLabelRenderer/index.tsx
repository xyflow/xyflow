import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStoreApi } from '../../hooks/useStore';
import { EDGE_LABEL_RENDERER_MAIN_CLASS } from '../../constants/component';

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const store = useStoreApi();
  const {
    rootElementRef: { current: rootElement },
  } = store.getState();

  if (!rootElement) {
    return null;
  }

  const collection = rootElement.getElementsByClassName(EDGE_LABEL_RENDERER_MAIN_CLASS);

  const edgeLabelRendererElement = collection.item(0);
  if (!edgeLabelRendererElement) {
    return null;
  }

  return createPortal(children, edgeLabelRendererElement);
}

export default EdgeLabelRenderer;
