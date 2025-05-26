import type { Edge, Node } from '../types';
import { watch } from 'vue';
import { useVueFlow } from './useVueFlow';

/**
 * Composable that handles the initialization of the viewport.
 *
 * Takes the store explicitly because it runs inside `<VueFlow>`'s own setup, where `inject` can't see
 * `<VueFlow>`'s own `provide` (provide reaches descendants only). Defaults to `useVueFlow()` for
 * descendant callers.
 *
 * @internal
 */
export function useOnInitHandler<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  vfInstance = useVueFlow<NodeType, EdgeType>(),
) {
  watch(
    () => vfInstance.viewportInitialized.value,
    (isInitialized) => {
      if (isInitialized) {
        vfInstance.emits.init(vfInstance);
      }
    },
    // `flush: 'post'` runs the callback after the viewport DOM update, so consumers' `onInit` see the
    // initialized viewport. Replaces a `setTimeout(() => …, 1)` that deferred the emit by a macrotask to
    // approximate the same "after the viewport is ready" timing.
    { flush: 'post' },
  );
}
