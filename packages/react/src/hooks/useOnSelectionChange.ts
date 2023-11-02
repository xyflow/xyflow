import { useEffect } from 'react';

import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc } from '../types';

export type UseOnSelectionChangeOptions = {
  onChange: OnSelectionChangeFunc;
};

function useOnSelectionChange({ onChange }: UseOnSelectionChangeOptions) {
  const store = useStoreApi();

  useEffect(() => {
    const addedOnSelectionChange = [...store.getState().onSelectionChange, onChange];
    store.setState({ onSelectionChange: addedOnSelectionChange });
    return () => {
      const removedOnSelectionChange = store.getState().onSelectionChange.filter((fn) => fn !== onChange);
      store.setState({ onSelectionChange: removedOnSelectionChange });
    };
  }, [onChange]);
}

export default useOnSelectionChange;
