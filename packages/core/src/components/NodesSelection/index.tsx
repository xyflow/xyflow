/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import { memo, useRef, useEffect } from 'react';
import type { MouseEvent, KeyboardEvent } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { getRectOfNodes } from '../../utils/graph';
import useDrag from '../../hooks/useDrag';
import { arrowKeyDiffs } from '../Nodes/wrapNode';
import useUpdateNodePositions from '../../hooks/useUpdateNodePositions';
import type { Node, ReactFlowState } from '../../types';

export interface NodesSelectionProps {
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
  noPanClassName?: string;
  disableKeyboardA11y: boolean;
}

const selector = (s: ReactFlowState) => ({
  transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
  userSelectionActive: s.userSelectionActive,
});

const bboxSelector = (s: ReactFlowState) => {
  const selectedNodes = Array.from(s.nodeInternals.values()).filter((n) => n.selected);
  return getRectOfNodes(selectedNodes, s.nodeOrigin);
};

function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }: NodesSelectionProps) {
  const store = useStoreApi();
  const { transformString, userSelectionActive } = useStore(selector, shallow);
  const { width, height, x: left, y: top } = useStore(bboxSelector, shallow);
  const updatePositions = useUpdateNodePositions();

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!disableKeyboardA11y) {
      nodeRef.current?.focus();
    }
  }, [disableKeyboardA11y]);

  useDrag({
    nodeRef,
  });

  if (userSelectionActive || !width || !height) {
    return null;
  }

  const onContextMenu = onSelectionContextMenu
    ? (event: MouseEvent) => {
        const selectedNodes = Array.from(store.getState().nodeInternals.values()).filter((n) => n.selected);
        onSelectionContextMenu(event, selectedNodes);
      }
    : undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      updatePositions(arrowKeyDiffs[event.key]);
    }
  };

  return (
    <div
      className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])}
      style={{
        transform: transformString,
      }}
    >
      <div
        ref={nodeRef}
        className="react-flow__nodesselection-rect"
        onContextMenu={onContextMenu}
        tabIndex={disableKeyboardA11y ? undefined : -1}
        onKeyDown={disableKeyboardA11y ? undefined : onKeyDown}
        style={{
          width,
          height,
          top,
          left,
        }}
      />
    </div>
  );
}

export default memo(NodesSelection);
