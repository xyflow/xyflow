import { MouseEvent } from 'react';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import { containerStyle } from '../../styles';
import type { ReactFlowState } from '../../types';
import type { FlowRendererProps } from '.';

type PaneProps = Pick<FlowRendererProps, 'onClick' | 'onContextMenu' | 'onWheel'> & {
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
};

const selector = (s: ReactFlowState) => s.paneDragging;

function Pane({ onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onWheel }: PaneProps) {
  const dragging = useStore(selector);

  return (
    <div
      className={cc(['react-flow__pane', { dragging }])}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
      onWheel={onWheel}
      style={containerStyle}
    />
  );
}

export default Pane;
