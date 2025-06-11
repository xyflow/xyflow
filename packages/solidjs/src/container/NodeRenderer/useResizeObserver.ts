import { SolidFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { InternalNodeUpdate } from '@xyflow/system';
import { createEffect, createSignal, onCleanup, untrack } from 'solid-js';

const selector = (s: SolidFlowState) => s.updateNodeInternals;

export function useResizeObserver() {
  const updateNodeInternals = useStore(selector);
  const createInitial = () => {
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

      // untrack(() => {
      if (updates.size > 0) {
        updateNodeInternals(updates);
      }
      // });
    });
  };

  const [resizeObserver] = createSignal(createInitial());

  onCleanup(() => {
    resizeObserver()?.disconnect();
  });

  return resizeObserver;
}
