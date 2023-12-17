/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import { memo, useRef, useEffect, type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { getNodesBounds } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import useDrag from '../../hooks/useDrag';
import useUpdateNodePositions from '../../hooks/useUpdateNodePositions';
import type { Node, ReactFlowState } from '../../types';
import { arrowKeyDiffs } from '../NodeWrapper/utils';

export type NodesSelectionProps = {
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
  noPanClassName?: string;
  disableKeyboardA11y: boolean;
};

const selector = (s: ReactFlowState) => {
  const selectedNodes = s.nodes.filter((n) => n.selected);
  const { width, height, x, y } = getNodesBounds(selectedNodes, s.nodeOrigin);

  return {
    width,
    height,
    userSelectionActive: s.userSelectionActive,
    transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]}) translate(${x}px,${y}px)`,
  };
};

function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }: NodesSelectionProps) {
  const store = useStoreApi();
  const { width, height, transformString, userSelectionActive } = useStore(selector, shallow);
  const updatePositions = useUpdateNodePositions();

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!disableKeyboardA11y) {
      nodeRef.current?.focus({
        preventScroll: true,
      });
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
        const selectedNodes = store.getState().nodes.filter((n) => n.selected);
        onSelectionContextMenu(event, selectedNodes);
      }
    : undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      updatePositions({
        x: arrowKeyDiffs[event.key].x,
        y: arrowKeyDiffs[event.key].y,
        isShiftPressed: event.shiftKey,
      });
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
        }}
      />
    </div>
  );
}

export default memo(NodesSelection);
