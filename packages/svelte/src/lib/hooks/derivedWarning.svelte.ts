import { key } from '$lib/store';
import type { StoreContext } from '$lib/store/types';
import { getContext } from 'svelte';

export function derivedWarning(functionName: string) {
  const storeContext = getContext<StoreContext>(key);

  if (!storeContext) {
    throw new Error(
      `In order to use ${functionName}() you need to wrap your component in a <SvelteFlowProvider />`
    );
  }

  if (storeContext.provider && !$effect.tracking()) {
    console.warn(
      `Use $derived(${functionName}()), when not calling inside a child of the <SvelteFlow /> component.`
    );
  }
}
