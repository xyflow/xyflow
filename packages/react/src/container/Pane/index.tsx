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
import {
  getNodesInside,
  getEventPosition,
  SelectionMode,
  areSetsEqual,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/system';

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
  connectionInProgress: s.connection.inProgress,
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
  const store = useStoreApi();
  const { userSelectionActive, elementsSelectable, dragging, connectionInProgress } = useStore(selector, shallow);
  const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);

  const container = useRef<HTMLDivElement | null>(null);
  const containerBounds = useRef<DOMRect>();

  const selectedNodeIds = useRef<Set<string>>(new Set());
  const selectedEdgeIds = useRef<Set<string>>(new Set());

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  const selectionInProgress = useRef<boolean>(false);
  const selectionStarted = useRef<boolean>(false);

  const onClick = (event: ReactMouseEvent) => {
    // We prevent click events when the user let go of the selectionKey during a selection
    // We also prevent click events when a connection is in progress
    if (selectionInProgress.current || connectionInProgress) {
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
    const { resetSelectedElements, domNode } = store.getState();
    containerBounds.current = domNode?.getBoundingClientRect();

    if (
      !elementsSelectable ||
      !isSelecting ||
      event.button !== 0 ||
      event.target !== container.current ||
      !containerBounds.current
    ) {
      return;
    }

    (event.target as Partial<Element> | null)?.setPointerCapture?.(event.pointerId);

    selectionStarted.current = true;
    selectionInProgress.current = false;

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
    const {
      userSelectionRect,
      transform,
      nodeLookup,
      edgeLookup,
      connectionLookup,
      triggerNodeChanges,
      triggerEdgeChanges,
      defaultEdgeOptions,
    } = store.getState();

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

    const prevSelectedNodeIds = selectedNodeIds.current;
    const prevSelectedEdgeIds = selectedEdgeIds.current;

    selectedNodeIds.current = new Set(
      getNodesInside(nodeLookup, nextUserSelectRect, transform, selectionMode === SelectionMode.Partial, true).map(
        (node) => node.id
      )
    );

    selectedEdgeIds.current = new Set();
    const edgesSelectable = defaultEdgeOptions?.selectable ?? true;

    // We look for all edges connected to the selected nodes
    for (const nodeId of selectedNodeIds.current) {
      const connections = connectionLookup.get(nodeId);
      if (!connections) continue;
      for (const { edgeId } of connections.values()) {
        const edge = edgeLookup.get(edgeId);
        if (edge && (edge.selectable ?? edgesSelectable)) {
          selectedEdgeIds.current.add(edgeId);
        }
      }
    }

    if (!areSetsEqual(prevSelectedNodeIds, selectedNodeIds.current)) {
      const changes = getSelectionChanges(nodeLookup, selectedNodeIds.current, true) as NodeChange[];
      triggerNodeChanges(changes);
    }

    if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.current)) {
      const changes = getSelectionChanges(edgeLookup, selectedEdgeIds.current) as EdgeChange[];
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

    (event.target as Partial<Element>)?.releasePointerCapture?.(event.pointerId);
    const { userSelectionRect } = store.getState();

    /*
     * We only want to trigger click functions when in selection mode if
     * the user did not move the mouse.
     */
    if (!userSelectionActive && userSelectionRect && event.target === container.current) {
      onClick?.(event);
    }

    store.setState({
      userSelectionActive: false,
      userSelectionRect: null,
      nodesSelectionActive: selectedNodeIds.current.size > 0,
    });
    onSelectionEnd?.(event);

    /*
     * If the user kept holding the selectionKey during the selection,
     * we need to reset the selectionInProgress, so the next click event is not prevented
     */
    if (selectionKeyPressed || selectionOnDrag) {
      selectionInProgress.current = false;
    }

    selectionStarted.current = false;
  };

  const draggable = panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0));

  return (
    <div
      className={cc(['react-flow__pane', { draggable, dragging, selection: isSelecting }])}
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
