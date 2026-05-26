import { useEffect, useRef } from 'react';
import { XYError, XYErrorCode } from '@xyflow/system';

import { reportError } from '../../errors';
import { useStoreApi } from '../../hooks/useStore';

export function useStylesLoadedWarning() {
  const store = useStoreApi();
  const checked = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!checked.current) {
        const pane = document.querySelector('.react-flow__pane');

        if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
          const error = new XYError(XYErrorCode.MISSING_STYLES, 'react');
          reportError(store.getState().onError, error);
        }

        checked.current = true;
      }
    }
  }, []);
}
