import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc } from '../types';
import { createEffect, onCleanup } from 'solid-js';

export type UseOnSelectionChangeOptions = {
  onChange: OnSelectionChangeFunc;
};

/**
 * Hook for registering an onSelectionChange handler.
 *
 * @public
 * @param params.onChange - The handler to register
 */
export function useOnSelectionChange(p: UseOnSelectionChangeOptions) {
  const store = useStoreApi();

  createEffect(() => {
    const nextOnSelectionChangeHandlers = [...store.onSelectionChangeHandlers.get(), p.onChange];
    store.onSelectionChangeHandlers.set(nextOnSelectionChangeHandlers);

    onCleanup(() => {
      const nextHandlers = store.onSelectionChangeHandlers.get().filter((fn) => fn !== p.onChange);
      store.onSelectionChangeHandlers.set(nextHandlers);
    });
  });
}
