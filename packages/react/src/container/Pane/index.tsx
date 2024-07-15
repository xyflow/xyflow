/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';
import { getNodesInside, getEventPosition, SelectionMode, type NodeChange, type EdgeChange } from '@xyflow/system';

import { UserSelection } from '../../components/UserSelection';
import { containerStyle } from '../../styles/utils';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils';
import type { ReactFlowProps, ReactFlowState } from '../../types';

type PaneProps = {
  isSelecting: boolean;
  selectionKeyPressed: boolean;
  children: ReactNode;
} & Partial<
  Pick<
    ReactFlowProps,
    | 'selectionMode'
    | 'panOnDrag'
    | 'onSelectionStart'
    | 'onSelectionEnd'
    | 'onPaneClick'
    | 'onPaneContextMenu'
    | 'onPaneScroll'
    | 'onPaneMouseEnter'
    | 'onPaneMouseMove'
    | 'onPaneMouseLeave'
    | 'selectionOnDrag'
  >
>;

const wrapHandler = (
  handler: React.MouseEventHandler | undefined,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): React.MouseEventHandler => {
  return (event: ReactMouseEvent) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler?.(event);
  };
};

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
  dragging: s.paneDragging,
});

export function Pane({
  isSelecting,
  selectionKeyPressed,
  selectionMode = SelectionMode.Full,
  panOnDrag,
  selectionOnDrag,
  onSelectionStart,
  onSelectionEnd,
  onPaneClick,
  onPaneContextMenu,
  onPaneScroll,
  onPaneMouseEnter,
  onPaneMouseMove,
  onPaneMouseLeave,
  children,
}: PaneProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const store = useStoreApi();
  const prevSelectedNodesCount = useRef<number>(0);
  const prevSelectedEdgesCount = useRef<number>(0);
  const containerBounds = useRef<DOMRect>();
  const edgeIdLookup = useRef<Map<string, Set<string>>>(new Map());

  const { userSelectionActive, elementsSelectable, dragging } = useStore(selector, shallow);
  const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  const selectionInProgress = useRef<boolean>(false);
  const selectionStarted = useRef<boolean>(false);

  const resetUserSelection = () => {
    store.setState({ userSelectionActive: false, userSelectionRect: null });

    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };

  const onClick = (event: ReactMouseEvent) => {
    // We prevent click events when the user let go of the selectionKey during a selection
    if (selectionInProgress.current) {
      selectionInProgress.current = false;
      return;
    }

    onPaneClick?.(event);
    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };

  const onContextMenu = (event: ReactMouseEvent) => {
    if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }

    onPaneContextMenu?.(event);
  };

  const onWheel = onPaneScroll ? (event: React.WheelEvent) => onPaneScroll(event) : undefined;

  const onPointerDown = (event: ReactPointerEvent): void => {
    const { resetSelectedElements, domNode, edgeLookup } = store.getState();
    containerBounds.current = domNode?.getBoundingClientRect();
    (event.target as Element)?.setPointerCapture?.(event.pointerId);

    if (
      !elementsSelectable ||
      !isSelecting ||
      event.button !== 0 ||
      event.target !== container.current ||
      !containerBounds.current
    ) {
      return;
    }

    selectionStarted.current = true;
    selectionInProgress.current = false;
    edgeIdLookup.current = new Map();

    for (const [id, edge] of edgeLookup) {
      edgeIdLookup.current.set(edge.source, edgeIdLookup.current.get(edge.source)?.add(id) || new Set([id]));
      edgeIdLookup.current.set(edge.target, edgeIdLookup.current.get(edge.target)?.add(id) || new Set([id]));
    }

    const { x, y } = getEventPosition(event.nativeEvent, containerBounds.current);

    resetSelectedElements();

    store.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: x,
        startY: y,
        x,
        y,
      },
    });

    onSelectionStart?.(event);
  };

  const onPointerMove = (event: ReactPointerEvent): void => {
    const { userSelectionRect, edgeLookup, transform, nodeLookup, triggerNodeChanges, triggerEdgeChanges } =
      store.getState();

    if (!containerBounds.current || !userSelectionRect) {
      return;
    }

    selectionInProgress.current = true;

    const { x: mouseX, y: mouseY } = getEventPosition(event.nativeEvent, containerBounds.current);
    const { startX, startY } = userSelectionRect;

    const nextUserSelectRect = {
      startX,
      startY,
      x: mouseX < startX ? mouseX : startX,
      y: mouseY < startY ? mouseY : startY,
      width: Math.abs(mouseX - startX),
      height: Math.abs(mouseY - startY),
    };

    const selectedNodes = getNodesInside(
      nodeLookup,
      nextUserSelectRect,
      transform,
      selectionMode === SelectionMode.Partial,
      true
    );

    const selectedEdgeIds = new Set<string>();
    const selectedNodeIds = new Set<string>();

    for (const selectedNode of selectedNodes) {
      selectedNodeIds.add(selectedNode.id);

      const edgeIds = edgeIdLookup.current.get(selectedNode.id);

      if (edgeIds) {
        for (const edgeId of edgeIds) {
          selectedEdgeIds.add(edgeId);
        }
      }
    }

    if (prevSelectedNodesCount.current !== selectedNodeIds.size) {
      prevSelectedNodesCount.current = selectedNodeIds.size;
      const changes = getSelectionChanges(nodeLookup, selectedNodeIds, true) as NodeChange[];
      triggerNodeChanges(changes);
    }

    if (prevSelectedEdgesCount.current !== selectedEdgeIds.size) {
      prevSelectedEdgesCount.current = selectedEdgeIds.size;
      const changes = getSelectionChanges(edgeLookup, selectedEdgeIds) as EdgeChange[];
      triggerEdgeChanges(changes);
    }

    store.setState({
      userSelectionRect: nextUserSelectRect,
      userSelectionActive: true,
      nodesSelectionActive: false,
    });
  };

  const onPointerUp = (event: ReactPointerEvent) => {
    if (event.button !== 0 || !selectionStarted.current) {
      return;
    }

    (event.target as Element)?.releasePointerCapture?.(event.pointerId);
    const { userSelectionRect } = store.getState();
    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!userSelectionActive && userSelectionRect && event.target === container.current) {
      onClick?.(event);
    }

    if (prevSelectedNodesCount.current > 0) {
      store.setState({ nodesSelectionActive: true });
    }

    resetUserSelection();
    onSelectionEnd?.(event);

    // If the user kept holding the selectionKey during the selection,
    // we need to reset the selectionInProgress, so the next click event is not prevented
    if (selectionKeyPressed || selectionOnDrag) {
      selectionInProgress.current = false;
    }

    selectionStarted.current = false;
  };

  return (
    <div
      className={cc(['react-flow__pane', { draggable: panOnDrag, dragging, selection: isSelecting }])}
      onClick={hasActiveSelection ? undefined : wrapHandler(onClick, container)}
      onContextMenu={wrapHandler(onContextMenu, container)}
      onWheel={wrapHandler(onWheel, container)}
      onPointerEnter={hasActiveSelection ? undefined : onPaneMouseEnter}
      onPointerDown={hasActiveSelection ? onPointerDown : onPaneMouseMove}
      onPointerMove={hasActiveSelection ? onPointerMove : onPaneMouseMove}
      onPointerUp={hasActiveSelection ? onPointerUp : undefined}
      onPointerLeave={onPaneMouseLeave}
      ref={container}
      style={containerStyle}
    >
      {children}
      <UserSelection />
    </div>
  );
}
