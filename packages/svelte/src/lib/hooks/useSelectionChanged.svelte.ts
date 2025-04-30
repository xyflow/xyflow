import type { OnSelectionChanged } from '$lib/types';
import { useStore } from '$lib/hooks/useStore';

export function useSelectionChanged(onselectionchanged: OnSelectionChanged) {
  const store = $derived(useStore());
  const symbol = Symbol();

  $effect(() => {
    store.selectionChangedHandlers.set(symbol, onselectionchanged);

    return () => {
      store.selectionChangedHandlers.delete(symbol);
    };
  });
}
