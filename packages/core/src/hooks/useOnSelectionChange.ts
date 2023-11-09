import { useEffect } from 'react';

import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc } from '../types';

export type UseOnSelectionChangeOptions = {
  onChange: OnSelectionChangeFunc;
};

function useOnSelectionChange({ onChange }: UseOnSelectionChangeOptions) {
  const store = useStoreApi();

  useEffect(() => {
    const nextSelectionChangeHandlers = [...store.getState().onSelectionChange, onChange];
    store.setState({ onSelectionChange: nextSelectionChangeHandlers });

    return () => {
      const nextHandlers = store.getState().onSelectionChange.filter((fn) => fn !== onChange);
      store.setState({ onSelectionChange: nextHandlers });
    };
  }, [onChange]);
}

export default useOnSelectionChange;
