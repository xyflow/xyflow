// import type { HTMLAttributes, ReactNode } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { ParentProps, mergeProps, JSX } from 'solid-js';

export interface PanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Set position of the panel
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  position?: PanelPosition;
}

const selector = (s: SolidFlowState) => () => s.userSelectionActive.get() ? 'none' : 'all';

export function Panel(_p: ParentProps<PanelProps>) {
  const p = mergeProps({ position: 'top-left' }, _p);

  const pointerEvents = useStore(selector);
  const positionClasses = () => `${p.position}`.split('-');

  const style = (): JSX.CSSProperties => {
    if (typeof p.style === 'object') {
      return {
        ...p.style,
        'pointer-events': pointerEvents(),
      };
    } else {
      return { 'pointer-events': pointerEvents() };
    }
  };

  return (
    <div {...p} class={cc(['react-flow__panel', p.class, ...positionClasses()])} style={style()}>
      {p.children}
    </div>
  );
}
