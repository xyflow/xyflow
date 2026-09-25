import { useEffect, useRef, useState } from 'react';

import { ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { InternalNodeUpdate } from '@xyflow/system';

const selector = (s: ReactFlowState) => s.updateNodeInternals;

export function useResizeObserver() {
  const updateNodeInternals = useStore(selector);
  const updates = useRef(new Map<string, InternalNodeUpdate>());
  const frameId = useRef<number | null>(null);
  const [resizeObserver] = useState(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry: ResizeObserverEntry) => {
        const id = entry.target.getAttribute('data-id') as string;
        updates.current.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
          force: true,
        });
      });

      if (frameId.current === null) {
        frameId.current = requestAnimationFrame(() => {
          frameId.current = null;
          updateNodeInternals(updates.current);
          updates.current.clear();
        });
      }
    });
  });

  useEffect(() => {
    return () => {
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
      updates.current.clear();
      resizeObserver?.disconnect();
    };
  }, [resizeObserver]);

  return resizeObserver;
}
