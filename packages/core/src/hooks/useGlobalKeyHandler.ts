import { useEffect } from 'react';

import { useStoreApi } from '../hooks/useStore';
import useKeyPress from './useKeyPress';
import { KeyCode } from '../types';
import useReactFlow from './useReactFlow';

interface HookParams {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStoreApi();
  const { deleteSelectedElements } = useReactFlow();

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    if (deleteKeyPressed) {
      deleteSelectedElements();
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
