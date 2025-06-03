import type { OnViewportChange } from '@xyflow/system';

import { useStoreApi } from './useStore';
import { createEffect } from 'solid-js';

export type UseOnViewportChangeOptions = {
  onStart?: OnViewportChange;
  onChange?: OnViewportChange;
  onEnd?: OnViewportChange;
};

/**
 * Hook for registering an onViewportChange handler.
 *
 * @public
 * @param params.onStart - gets called when the viewport starts changing
 * @param params.onChange - gets called when the viewport changes
 * @param params.onEnd - gets called when the viewport stops changing
 */
export function useOnViewportChange({ onStart, onChange, onEnd }: UseOnViewportChangeOptions) {
  const store = useStoreApi();

  createEffect(() => {
    store.onViewportChangeStart.set(onStart);
  });

  createEffect(() => {
    store.onViewportChange.set(onChange);
  });

  createEffect(() => {
    store.onViewportChangeEnd.set(onEnd);
  });
}
