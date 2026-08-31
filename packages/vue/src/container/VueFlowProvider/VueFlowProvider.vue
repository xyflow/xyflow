<script lang="ts" setup generic="NodeType extends Node = Node, EdgeType extends Edge = Edge">
import type { Edge, Node, VueFlowProps } from '../../types';
import { useCreateVueFlow } from '../../composables/useCreateVueFlow';

/**
 * Owns a Vue Flow store and `provide`s it to its subtree. A descendant `<VueFlow>` reuses this provided
 * store instead of creating its own, and any component that calls `useVueFlow()` below this point resolves
 * the same store via `inject` — the way to share one store across sibling components. One provider scopes
 * one store, so host a single `<VueFlow>` per provider and use a separate provider for each independent flow.
 *
 * Accepts the same options as {@link setupVueFlow} to seed the initial store: pass `nodes`, `edges`, or any
 * other `VueFlowProps` and they become the store's initial values. The seed is read once when the store is
 * created and is not reactive — a descendant `<VueFlow>`'s own props still apply to the store afterwards.
 */
const props = defineProps<VueFlowProps<NodeType, EdgeType>>();

useCreateVueFlow<NodeType, EdgeType>(props);
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
