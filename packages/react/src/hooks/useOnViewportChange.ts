import { useEffect } from 'react';
import type { OnViewportChange } from '@xyflow/system';

import { useStoreApi } from './useStore';

export type UseOnViewportChangeOptions = {
  /** Gets called when the viewport starts changing. */
  onStart?: OnViewportChange;
  /** Gets called when the viewport changes. */
  onChange?: OnViewportChange;
  /** Gets called when the viewport stops changing. */
  onEnd?: OnViewportChange;
};

/**
 * The `useOnViewportChange` hook lets you listen for changes to the viewport such
 * as panning and zooming. You can provide a callback for each phase of a viewport
 * change: `onStart`, `onChange`, and `onEnd`.
 *
 * @public
 * @example
 * ```jsx
 *import { useCallback } from 'react';
 *import { useOnViewportChange } from '@xyflow/react';
 *
 *function ViewportChangeLogger() {
 *  useOnViewportChange({
 *    onStart: (viewport: Viewport) => console.log('start', viewport),
 *    onChange: (viewport: Viewport) => console.log('change', viewport),
 *    onEnd: (viewport: Viewport) => console.log('end', viewport),
 *  });
 *
 *  return null;
 *}
 *```
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
