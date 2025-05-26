<script lang="ts" setup>
import { useCreateVueFlow } from '../../composables/useCreateVueFlow';

/**
 * Owns a VueFlow store and `provide`s it to its subtree. A descendant `<VueFlow>` reuses this
 * provided store instead of creating its own, and any component that calls `useVueFlow()` below this
 * point resolves the same store via `inject` — the way to share one store across sibling components
 * (mirrors `<ReactFlowProvider>` / `<SvelteFlowProvider>`). One provider scopes one store, so host a
 * single `<VueFlow>` per provider and use a separate provider for each independent flow.
 */
const props = defineProps<{ id?: string }>();

useCreateVueFlow({ id: props.id });
</script>

<script lang="ts">
export default {
  name: 'VueFlowProvider',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <slot />
</template>
