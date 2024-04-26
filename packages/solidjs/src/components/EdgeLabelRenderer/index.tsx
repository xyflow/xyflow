
import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { Portal } from 'solid-js/web';
import { ParentProps, Show } from 'solid-js';

const selector = (s: SolidFlowState) => () => s.domNode.get()?.querySelector('.react-flow__edgelabel-renderer');

export function EdgeLabelRenderer(p: ParentProps) {
  const edgeLabelRenderer = useStore(selector);

  return (
    <Show when={edgeLabelRenderer()}>
      {(el) => {
        return <Portal mount={el()}>{p.children}</Portal>;
      }}
    </Show>
  );
}
