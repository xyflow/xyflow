import { useEffect } from 'react';
import type { KeyCode } from '@xyflow/system';

import { useReactFlowStoreApi } from './useReactFlowStore';
import { useKeyPress } from './useKeyPress';
import { useReactFlow } from './useReactFlow';
import { Edge, Node } from '../types';

const selected = (item: Node | Edge) => item.selected;

const win = typeof window !== 'undefined' ? window : undefined;

/**
 * Hook for handling global key events.
 *
 * @internal
 */
export function useGlobalKeyHandler({
  deleteKeyCode,
  multiSelectionKeyCode,
}: {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}): void {
  const { optionsStore, nodesStore, edgesStore } = useReactFlowStoreApi();
  const { deleteElements } = useReactFlow();

  const deleteKeyPressed = useKeyPress(deleteKeyCode, { actInsideInputWithModifier: false });
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode, { target: win });

  useEffect(() => {
    if (deleteKeyPressed) {
      const { edges } = edgesStore.getState();
      const { nodes } = nodesStore.getState();
      void deleteElements({ nodes: nodes.filter(selected), edges: edges.filter(selected) });
      if (optionsStore.getState().nodesSelectionActive) {
        optionsStore.setState({ nodesSelectionActive: false });
      }
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    optionsStore.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
}
