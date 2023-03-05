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
  const resetSelectionKeyPressed = useKeyPress('Escape');

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

  useEffect(() => {
    const { getNodes } = store.getState();
    console.log('esc before reset', getNodes());
    store.getState().resetSelectedElements();
    const selectedNodes = getNodes().filter((node) => node.selected);
    console.log('esc after reset', selectedNodes);
    store.setState({ nodesSelectionActive: false });
  }, [resetSelectionKeyPressed]);
};
