import { useEffect } from 'react';

import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc } from '../types';

export type UseOnSelectionChangeOptions = {
  onChange?: OnSelectionChangeFunc;
};

function useOnSelectionChange({ onChange }: UseOnSelectionChangeOptions) {
  const store = useStoreApi();

  useEffect(() => {
    store.setState({ onSelectionChange: onChange });
  }, [onChange]);
}

export default useOnSelectionChange;
