import { useEffect } from 'react';
import type { OnSelectionChangeFunc } from '@reactflow/system';

import { useStoreApi } from './useStore';

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
