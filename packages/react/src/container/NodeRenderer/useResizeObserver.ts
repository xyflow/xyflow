import { useEffect, useMemo, useRef } from 'react';

import { ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { InternalNodeUpdate } from '@xyflow/system';

const selector = (s: ReactFlowState) => s.updateNodeInternals;

export function useResizeObserver() {
  const updateNodeInternals = useStore(selector);
  const resizeObserverRef = useRef<ResizeObserver>();

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = new Map<string, InternalNodeUpdate>();

      entries.forEach((entry: ResizeObserverEntry) => {
        const id = entry.target.getAttribute('data-id') as string;
        updates.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
        });
      });

      updateNodeInternals(updates);
    });

    resizeObserverRef.current = observer;

    return observer;
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef?.current?.disconnect();
    };
  }, []);

  return resizeObserver;
}
