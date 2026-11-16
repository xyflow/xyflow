import type { Edge, Node, VueFlowState } from '../types';
import { onScopeDispose, watch } from 'vue';

// high-frequency events are skipped so the console isn't flooded during drag/pan/hover
const SKIP = new Set<string>([
  'move',
  'nodeDrag',
  'selectionDrag',
  'viewportChange',
  'nodeMouseMove',
  'paneMouseMove',
]);

/**
 * When `state.debug` is on, log each Vue Flow event to the console as it fires (skipping high-frequency ones
 * like move/drag). Subscribes across the store's hooks via one loop rather than scattering `console.log`s
 * through the actions. Reactive to `debug` and disposed with the owning scope.
 *
 * @internal
 */
export function useDebug<NodeType extends Node = Node, EdgeType extends Edge = Edge>(state: VueFlowState<NodeType, EdgeType>) {
  let disposers: (() => void)[] = [];

  function disable() {
    for (const off of disposers) {
      off();
    }
    disposers = [];
  }

  function enable() {
    for (const [name, hook] of Object.entries(state.hooks)) {
      if (SKIP.has(name)) {
        continue;
      }

      const { off } = hook.on((payload) => {
        // eslint-disable-next-line no-console
        console.log(`[Vue Flow] ${name}`, payload);
      });

      disposers.push(off);
    }
  }

  watch(
    () => state.debug,
    (on) => {
      disable();
      if (on) {
        enable();
      }
    },
    { immediate: true },
  );

  onScopeDispose(disable);
}
