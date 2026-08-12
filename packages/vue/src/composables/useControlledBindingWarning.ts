import type { NodeChangeset } from '@xyflow/system';
import type { Edge, Node } from '../types';
import { getCurrentInstance } from 'vue';
import { hasVNodeListener, isDev, warn } from '../utils';
import { useVueFlow } from './useVueFlow';

/**
 * Dev-only warning for a controlled binding with no change handler.
 * A one-way `:nodes`/`:edges` (no `v-model`) puts that collection in controlled mode,
 * Vue Flow applies nothing on its own,
 * so without a matching `@nodes-change`/`@edges-change` handler every change is silently dropped.
 *
 * Warns on the first dropped change.
 *
 * no-op in production.
 *
 * @internal
 */
export function useControlledBindingWarning<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  managed: { nodes: boolean; edges: boolean },
  vfInstance = useVueFlow<NodeType, EdgeType>()
) {
  if (!isDev()) {
    return;
  }

  const inst = getCurrentInstance();

  // Measurement is written to the lookup directly, so it applies fine without a handler, only real interactions (drag/select/remove) are dropped.
  // Warn on the first of those, not on the initial `dimensions` changes, so a genuinely static `:nodes` display isn't nagged.
  if (!managed.nodes && !hasVNodeListener(inst, 'nodesChange')) {
    const { off } = vfInstance.onNodesChange((changes: NodeChangeset<NodeType>) => {
      if (changes.toArray().some((change) => change.type !== 'dimensions')) {
        warn(
          '`<VueFlow>` got a one-way `:nodes` binding with no `@nodes-change` handler, so node interactions (drag, selection, removal) are dropped. Use `v-model:nodes` to let Vue Flow apply + sync them, or handle `@nodes-change` yourself.'
        );
        off();
      }
    });
  }

  if (!managed.edges && !hasVNodeListener(inst, 'edgesChange')) {
    const { off } = vfInstance.onEdgesChange(() => {
      warn(
        '`<VueFlow>` got a one-way `:edges` binding with no `@edges-change` handler, so edge interactions (selection, removal) are dropped. Use `v-model:edges` to let Vue Flow apply + sync them, or handle `@edges-change` yourself.'
      );
      off();
    });
  }
}
