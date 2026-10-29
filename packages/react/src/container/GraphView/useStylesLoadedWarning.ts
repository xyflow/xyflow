import { useEffect, useRef } from 'react';
import { errorMessages } from '@xyflow/system';

import { useReactFlowStoreApi } from '../../hooks/useReactFlowStore';

export function useStylesLoadedWarning() {
  const { optionsStore } = useReactFlowStoreApi();
  const checked = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!checked.current) {
        const pane = document.querySelector('.react-flow__pane');

        if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
          optionsStore.getState().onError?.('013', errorMessages['error013']('react'));
        }

        checked.current = true;
      }
    }
  }, []);
}
