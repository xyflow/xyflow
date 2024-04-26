
import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { ParentProps } from 'solid-js';

const selector = (s: SolidFlowState) => () => `translate(${s.transform.get()[0]}px,${s.transform.get()[1]}px) scale(${s.transform.get()[2]})`;


export function Viewport(p: ParentProps) {
  const transform = useStore(selector);

  return (
    <div class="react-flow__viewport xyflow__viewport react-flow__container" style={{ transform: transform() }}>
      {p.children}
    </div>
  );
}
