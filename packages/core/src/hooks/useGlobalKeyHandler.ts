import { useEffect } from 'react';

import { useStoreApi } from '../hooks/useStore';
import useKeyPress from './useKeyPress';
import type { KeyCode } from '../types';
import useReactFlow from './useReactFlow';
interface HookParams {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    if (deleteKeyPressed) {
      const { nodeInternals, edges } = store.getState();
      const nodes = Array.from(nodeInternals.values());
      const nodeIds = nodes.filter((node) => node.selected).map((node) => node.id);
      const edgeIds = edges.filter((edge) => edge.selected).map((edge) => edge.id);
      deleteElements(nodeIds, edgeIds);
      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
