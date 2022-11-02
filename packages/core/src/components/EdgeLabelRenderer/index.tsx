import { useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const wrapperRef = useRef(document.getElementById('edgelabel-portal'));

  if (!wrapperRef.current) {
    return null;
  }

  return createPortal(children, wrapperRef.current);
}

export default EdgeLabelRenderer;
