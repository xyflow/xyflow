import type { Edge, Node } from '../types';
import { onMounted } from 'vue';
import { ErrorCode, isDev, VueFlowError } from '../utils';
import { useVueFlow } from './useVueFlow';

/**
 * Takes the store explicitly because it runs inside `<VueFlow>`'s own setup, where `inject` can't see
 * `<VueFlow>`'s own `provide`. Defaults to `useVueFlow()` for descendant callers.
 *
 * @internal
 */
export function useStylesLoadedWarning<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  vfInstance = useVueFlow<NodeType, EdgeType>(),
) {
  const { emits } = vfInstance;

  onMounted(() => {
    if (isDev()) {
      const pane = document.querySelector('.vue-flow__pane');

      if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
        emits.error(new VueFlowError(ErrorCode.MISSING_STYLES));
      }
    }
  });
}
