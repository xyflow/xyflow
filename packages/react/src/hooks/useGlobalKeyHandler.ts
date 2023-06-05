import { useEffect } from 'react';
import type { KeyCode } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';
import useKeyPress from './useKeyPress';
import useReactFlow from './useReactFlow';

export default ({
  deleteKeyCode,
  multiSelectionKeyCode,
}: {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}): void => {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    if (deleteKeyPressed) {
      const { edges, getNodes } = store.getState();
      const selectedNodes = getNodes().filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);
      deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
