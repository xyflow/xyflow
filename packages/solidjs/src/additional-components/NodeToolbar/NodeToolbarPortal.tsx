import type { SolidFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { Portal } from 'solid-js/web';
import { ParentProps, Show } from 'solid-js';

const selector = (state: SolidFlowState) => () => state.domNode.get()?.querySelector('.react-flow__renderer');

export function NodeToolbarPortal(p: ParentProps) {
  const wrapperRef = useStore(selector);

  return <Show when={wrapperRef()}>
    {(el) => {
      return <Portal mount={el()}>{p.children}</Portal>;
    }}
  </Show>;
}
