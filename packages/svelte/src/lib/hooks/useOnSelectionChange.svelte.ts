import type { OnSelectionChange } from '$lib/types';
import { useStore } from '$lib/hooks/useStore';

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
