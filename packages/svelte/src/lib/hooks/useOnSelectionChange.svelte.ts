import type { OnSelectionChange } from '$lib/types/index.js';
import { useStore } from '$lib/hooks/useStore.js';

export function useOnSelectionChange(onselectionchange: OnSelectionChange) {
  const store = $derived(useStore());
  const symbol = Symbol();

  $effect(() => {
    store.selectionChangeHandlers.set(symbol, onselectionchange);

    return () => {
      store.selectionChangeHandlers.delete(symbol);
    };
  });
}
