import { useEffect, useState } from 'react';

import { ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { InternalNodeUpdate } from '@xyflow/system';

const selector = (s: ReactFlowState) => s.updateNodeInternals;

export function useResizeObserver() {
  const updateNodeInternals = useStore(selector);
  const [resizeObserver] = useState(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = new Map<string, InternalNodeUpdate>();
      entries.forEach((entry: ResizeObserverEntry) => {
        const id = entry.target.getAttribute('data-id') as string;
        updates.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
          force: true,
        });
      });

      updateNodeInternals(updates);
    });
  });

  useEffect(() => {
    return () => {
      resizeObserver?.disconnect();
    };
  }, [resizeObserver]);

  return resizeObserver;
}
