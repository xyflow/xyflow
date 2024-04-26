import { createEffect } from 'solid-js';
import { errorMessages } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';

export function useStylesLoadedWarning() {
  const store = useStoreApi();
  let checked = false;

  createEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!checked) {
        const pane = document.querySelector('.react-flow__pane');

        if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
          store.onError.get()?.('013', errorMessages['error013']('solid'));
        }

        checked = true;
      }
    }
  });
}
