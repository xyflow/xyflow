import { useEffect, useMemo, useRef } from 'react';

import { ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';

const selector = (s: ReactFlowState) => s.updateNodeDimensions;

export function useResizeObserver() {
  const updateNodeDimensions = useStore(selector);
  const resizeObserverRef = useRef<ResizeObserver>();

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = new Map();

      entries.forEach((entry: ResizeObserverEntry) => {
        const id = entry.target.getAttribute('data-id') as string;
        updates.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
          forceUpdate: true,
        });
      });

      updateNodeDimensions(updates);
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
