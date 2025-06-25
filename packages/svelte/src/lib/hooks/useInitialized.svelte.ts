import { useStore } from '$lib/store';
import { nodeHasDimensions } from '@xyflow/system';

/**
 * Hook for seeing if nodes are initialized
 * @returns A boolean that indicates if nodes are initialized
 * @public
 */
export function useNodesInitialized(includeHiddenNodes = false) {
  const { nodesInitialized, nodeLookup } = $derived(useStore());

  const initialized = $derived.by(() => {
    if (nodeLookup.size === 0) {
      return false;
    }

    if (!includeHiddenNodes) {
      return nodesInitialized;
    }

    for (const [, { internals }] of nodeLookup) {
      if (internals.handleBounds === undefined || !nodeHasDimensions(internals.userNode)) {
        return false;
      }
    }

    return true;
  });

  return {
    get current() {
      return initialized;
    }
  };
}

/**
 * Hook for seeing if the viewport is initialized
 * @returns - reactive viewportInitialized
 */
export function useViewportInitialized() {
  const { viewportInitialized } = $derived(useStore());
  return {
    get current() {
      return viewportInitialized;
    }
  };
}
