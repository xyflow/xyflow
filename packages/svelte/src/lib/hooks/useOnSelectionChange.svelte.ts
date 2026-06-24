import type { Edge, Node, OnSelectionChange } from '$lib/types';
import { useStore } from '$lib/hooks/useStore';

/**
 * Hook for listening to selection changes.
 *
 * @public
 * @param params - A function that returns the hook parameters
 * @param params.onChange - handler that gets called when the selection changes
 */
export function useOnSelectionChange<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  params: () => { onChange: OnSelectionChange<NodeType, EdgeType> }
) {
  const store = $derived(useStore<NodeType, EdgeType>());
  const symbol = Symbol();

  $effect(() => {
    const { onChange } = params();
    store.selectionChangeHandlers.set(symbol, onChange);

    return () => {
      store.selectionChangeHandlers.delete(symbol);
    };
  });
}
