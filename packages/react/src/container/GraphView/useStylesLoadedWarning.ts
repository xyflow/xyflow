import { useEffect, useRef } from 'react';
import { errorMessages } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';

export function useStylesLoadedWarning() {
  const store = useStoreApi();
  const checked = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!checked.current) {
        const pane = document.querySelector('.react-flow__pane');

        if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
          store.getState().onError?.('013', errorMessages['error013']('react'));
        }

        checked.current = true;
      }
    }
  }, []);
}
