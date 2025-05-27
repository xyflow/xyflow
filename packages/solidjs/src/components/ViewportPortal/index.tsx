// import type { ReactNode } from 'react';
// import { createPortal } from 'react-dom';

import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

const selector = (s: SolidFlowState) => () => s.domNode.get()?.querySelector('.react-flow__viewport-portal');

export function ViewportPortal(p: ParentProps) {
  const viewPortalDiv = useStore(selector);

  // if (!viewPortalDiv) {
  //   return null;
  // }
  return (
    <Show when={viewPortalDiv()}>
      {(el) => {
        return <Portal mount={el()}>{p.children}</Portal>;
      }}
    </Show>
  );

  // return createPortal(children, viewPortalDiv);
}
