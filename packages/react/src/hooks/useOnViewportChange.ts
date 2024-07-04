import { useEffect } from 'react';
import type { OnViewportChange } from '@xyflow/system';

import { useStoreApi } from './useStore';

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

  useEffect(() => {
    store.setState({ onViewportChangeStart: onStart });
  }, [onStart]);

  useEffect(() => {
    store.setState({ onViewportChange: onChange });
  }, [onChange]);

  useEffect(() => {
    store.setState({ onViewportChangeEnd: onEnd });
  }, [onEnd]);
}
