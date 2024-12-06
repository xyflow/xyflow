import { getContext } from 'svelte';
import type { StoreContext, SvelteFlowStore } from './types';

import { key } from './';

export function useStore(): SvelteFlowStore {
  const storeContext = getContext<StoreContext>(key);

  if (!storeContext) {
    throw new Error(
      'In order to use useStore you need to wrap your component in a <SvelteFlowProvider />'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    if (storeContext.provider && !$effect.tracking()) {
      console.warn(
        'Use $derived(useStore()), when not calling inside a child of the <SvelteFlow /> component.'
      );
    }
  }

  return storeContext.getStore();
}
