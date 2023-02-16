import { useEffect } from 'react';
import type { OnViewportChange } from '@reactflow/system';

import { useStoreApi } from './useStore';

export type UseOnViewportChangeOptions = {
  onStart?: OnViewportChange;
  onChange?: OnViewportChange;
  onEnd?: OnViewportChange;
};

function useOnViewportChange({ onStart, onChange, onEnd }: UseOnViewportChangeOptions) {
  const store = useStoreApi();

  useEffect(() => {
    store.setState({ onViewportChangeStart: onStart });
  }, [onStart]);

  useEffect(() => {
    store.setState({ onViewportChange: onChange });
  }, [onChange]);

  useEffect(() => {
    store.setState({ onViewportChangeEnd: onEnd });
  }, [onEnd]);
}

export default useOnViewportChange;
