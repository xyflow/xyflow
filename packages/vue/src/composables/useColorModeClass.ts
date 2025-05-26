import type { ColorModeClass } from '@xyflow/system';
import type { ComputedRef } from 'vue';
import type { Edge, Node, VueFlowState } from '../types';
import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
import { useStore } from './useStore';

/**
 * Resolves the `colorMode` prop to the `light`/`dark` class applied to the flow container, tracking
 * `prefers-color-scheme` reactively when `colorMode` is `system` (matching xyflow/react+svelte).
 *
 * Takes the state explicitly because it runs inside `<VueFlow>`'s own setup; defaults to `useStore()`.
 *
 * @internal
 */
export function useColorModeClass<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: VueFlowState<NodeType, EdgeType> = useStore<NodeType, EdgeType>(),
): ComputedRef<ColorModeClass> {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return computed(() => {
    if (state.colorMode === 'system') {
      return prefersDark.value ? 'dark' : 'light';
    }

    return state.colorMode;
  });
}
