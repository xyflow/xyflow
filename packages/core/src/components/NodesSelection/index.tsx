/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import { memo, useRef, useEffect } from 'react';
import type { MouseEvent, KeyboardEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';

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

const selector = (s: ReactFlowState) => {
  const selectedNodes = s.getNodes().filter((n) => n.selected);
  return {
    ...getRectOfNodes(selectedNodes, s.nodeOrigin),
    transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
    userSelectionActive: s.userSelectionActive,
  };
};

function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }: NodesSelectionProps) {
  const store = useStoreApi();
  const { width, height, x: left, y: top, transformString, userSelectionActive } = useStore(selector, shallow);
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
        const selectedNodes = store
          .getState()
          .getNodes()
          .filter((n) => n.selected);
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
          top,
          left,
        }}
      />
    </div>
  );
}

export default memo(NodesSelection);
