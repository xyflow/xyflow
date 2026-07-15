import type { Edge, Node, NodeChange } from '../types';
import { getCurrentInstance } from 'vue';
import { hasVNodeListener, isDev, warn } from '../utils';
import { useVueFlow } from './useVueFlow';

/**
 * Dev-only nudge for a controlled binding with no change handler. A one-way `:nodes`/`:edges` (no `v-model`)
 * puts that collection in controlled mode — Vue Flow applies nothing on its own — so without a matching
 * `@nodes-change`/`@edges-change` handler every change is silently dropped (measurement included) and the
 * flow looks broken with no error. Warn on the FIRST dropped change: the earliest, loudest signal that the
 * binding intent is wrong. Mirror of {@link useStylesLoadedWarning}; no-op in production.
 *
 * Reads the bound vnode props to detect the missing handler, so it must run in `<VueFlow>`'s own setup.
 *
 * @internal
 */
export function useControlledBindingWarning<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  managed: { nodes: boolean; edges: boolean },
  vfInstance = useVueFlow<NodeType, EdgeType>(),
) {
  if (!isDev()) {
    return;
  }

  const inst = getCurrentInstance();

  // Measurement is written to the lookup directly, so it applies fine without a handler — only real
  // interactions (drag/select/remove) are dropped. Warn on the first of those, not on the initial
  // `dimensions` changes, so a genuinely static `:nodes` display isn't nagged.
  if (!managed.nodes && !hasVNodeListener(inst, 'nodesChange')) {
    const { off } = vfInstance.onNodesChange((changes: NodeChange[]) => {
      if (changes.some(change => change.type !== 'dimensions')) {
        warn('`<VueFlow>` got a one-way `:nodes` binding with no `@nodes-change` handler, so node interactions (drag, selection, removal) are dropped. Use `v-model:nodes` to let Vue Flow apply + sync them, or handle `@nodes-change` yourself.');
        off();
      }
    });
  }

  // edges have no measurement/`dimensions` change, so any edge change is a real interaction — warn on the first
  if (!managed.edges && !hasVNodeListener(inst, 'edgesChange')) {
    const { off } = vfInstance.onEdgesChange(() => {
      warn('`<VueFlow>` got a one-way `:edges` binding with no `@edges-change` handler, so edge interactions (selection, removal) are dropped. Use `v-model:edges` to let Vue Flow apply + sync them, or handle `@edges-change` yourself.');
      off();
    });
  }
}
