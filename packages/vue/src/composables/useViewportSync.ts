import type { Viewport } from '@xyflow/system';
import type { Ref } from 'vue';
import type { Edge, Node, VueFlowState } from '../types';
import { watch } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';

function sameViewport(a: Viewport | undefined, b: Viewport | undefined) {
  return !!a && !!b && a.x === b.x && a.y === b.y && a.zoom === b.zoom;
}

/**
 * Two-way binds the `viewport` v-model to the store's canonical `transform`, matching xyflow/react's
 * controlled viewport and svelte's `bind:viewport`.
 *
 * - **in** (model → store): applies an externally-set `viewport` to the panzoom via `syncViewport` (which
 *   doesn't fire pan/zoom events) and mirrors it onto `transform`. Re-runs once the panzoom mounts so the
 *   controlled value wins over `ZoomPane`'s `defaultViewport` seed.
 * - **out** (store → model): writes `transform` changes back to the model so the binding stays in sync.
 *
 * Equality guards on both sides stop the round-trip from looping.
 *
 * @internal
 */
export function useViewportSync<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  model: Ref<Viewport | undefined>,
  state: VueFlowState<NodeType, EdgeType> = useStore<NodeType, EdgeType>(),
) {
  const { transform, panZoom } = storeToRefs(state);

  // also keyed on `panZoom` so the controlled value is re-applied once the instance mounts (its initial
  // `defaultViewport` seed would otherwise clobber a transform set before mount)
  watch(
    [model, panZoom],
    ([viewport]) => {
      if (!viewport) {
        return;
      }

      const current = { x: transform.value[0], y: transform.value[1], zoom: transform.value[2] };
      if (sameViewport(viewport, current)) {
        return;
      }

      panZoom.value?.syncViewport(viewport);
      transform.value = [viewport.x, viewport.y, viewport.zoom];
    },
    { immediate: true },
  );

  watch(transform, (next) => {
    const viewport = { x: next[0], y: next[1], zoom: next[2] };
    if (sameViewport(viewport, model.value)) {
      return;
    }

    model.value = viewport;
  });
}
