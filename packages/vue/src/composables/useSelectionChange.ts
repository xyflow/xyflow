import type { Edge, Node } from '../types';
import { watch } from 'vue';
import { useVueFlow } from './useVueFlow';

/**
 * Fires the `selectionChange` event whenever the set of selected nodes or edges changes. Membership is
 * tracked by id, so it fires on select/deselect — not on unrelated node/edge mutations.
 *
 * Takes the store explicitly because it runs inside `<VueFlow>`'s own setup, where `inject` can't see
 * `<VueFlow>`'s own `provide` (see {@link useOnInitHandler}). Defaults to `useVueFlow()` for descendant callers.
 *
 * @internal
 */
export function useSelectionChange<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  vfInstance = useVueFlow<NodeType, EdgeType>(),
) {
  watch(
    [
      () => vfInstance.getSelectedNodes.value.map(node => node.id).join(' '),
      () => vfInstance.getSelectedEdges.value.map(edge => edge.id).join(' '),
    ],
    () => {
      vfInstance.emits.selectionChange({
        nodes: [...vfInstance.getSelectedNodes.value],
        edges: [...vfInstance.getSelectedEdges.value],
      });
    },
  );
}
