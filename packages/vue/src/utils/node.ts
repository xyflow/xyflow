import type { Ref } from 'vue';
import type { Actions, InternalNode, NodeLookup } from '../types';
import { nextTick } from 'vue';

/**
 * Whether every node in the lookup has been measured — handle bounds resolved + non-zero dimensions. Hidden
 * nodes are skipped unless `includeHiddenNodes`. Shared by `useNodesInitialized` and `fitView`'s queue so the
 * "are nodes ready" check has a single definition.
 */
export function areNodesInitialized(nodeLookup: NodeLookup, includeHiddenNodes = false): boolean {
  if (nodeLookup.size === 0) {
    return false;
  }

  for (const node of nodeLookup.values()) {
    if (includeHiddenNodes || !node.hidden) {
      if (node.internals.handleBounds === undefined || !node.measured?.width || !node.measured?.height) {
        return false;
      }
    }
  }

  return true;
}

export function handleNodeClick(
  node: InternalNode,
  multiSelectionActive: boolean,
  addSelectedNodes: Actions['addSelectedNodes'],
  removeSelectedNodes: Actions['removeSelectedNodes'],
  nodesSelectionActive: Ref<boolean>,
  unselect = false,
  nodeEl: HTMLDivElement,
) {
  nodesSelectionActive.value = false;

  if (!node.selected) {
    addSelectedNodes([node]);
  }
  else if (unselect || (node.selected && multiSelectionActive)) {
    removeSelectedNodes([node]);

    nextTick(() => {
      nodeEl.blur();
    });
  }
}
