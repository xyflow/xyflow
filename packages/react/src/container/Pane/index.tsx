import { useRef, type MouseEvent, type PointerEvent, type WheelEvent, type ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';
import { getNodesInside, getEventPosition, SelectionMode, areSetsEqual } from '@xyflow/system';

import { UserSelection } from '../../components/UserSelection';
import { containerStyle } from '../../styles/utils';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils';
import type { ReactFlowProps, ReactFlowState } from '../../types';

type PaneProps = {
  isSelecting: boolean;
  selectionKeyPressed: boolean;
  children: ReactNode;
  paneClickDistance: number;
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
  paneClickDistance,
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
  const isSelectionEnabled = elementsSelectable && (isSelecting || userSelectionActive);

  const container = useRef<HTMLDivElement | null>(null);
  const containerBounds = useRef<DOMRect>();
  const selectedNodeIds = useRef(new Set<string>());
  const selectedEdgeIds = useRef(new Set<string>());

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  const selectionInProgress = useRef(false);

  const onClick = (event: MouseEvent) => {
    if (event.target !== container.current) {
      return;
    }
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

  const onContextMenu = (event: MouseEvent) => {
    if (event.target !== container.current) {
      return;
    }
    if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }

    onPaneContextMenu?.(event);
  };

  const onWheel = onPaneScroll
    ? (event: WheelEvent) => {
        if (event.target !== container.current) {
          return;
        }
        onPaneScroll(event);
      }
    : undefined;

  const onClickCapture = (event: MouseEvent) => {
    if (selectionInProgress.current) {
      event.stopPropagation();
      selectionInProgress.current = false;
    }
  };

  // We are using capture here in order to prevent other pointer events
  // to be able to create a selection above a node or an edge
  const onPointerDownCapture = (event: PointerEvent): void => {
    const { domNode } = store.getState();
    containerBounds.current = domNode?.getBoundingClientRect();
    if (!containerBounds.current) return;

    const eventTargetIsContainer = event.target === container.current;
    // if a child element has the 'nokey' class, we don't want to swallow the event and don't start a selection
    const isNoKeyEvent = !eventTargetIsContainer && !!(event.target as HTMLElement).closest('.nokey');
    const isSelectionActive = (selectionOnDrag && eventTargetIsContainer) || selectionKeyPressed;

    if (isNoKeyEvent || !isSelecting || !isSelectionActive || event.button !== 0 || !event.isPrimary) {
      return;
    }

    (event.target as Partial<Element>)?.setPointerCapture?.(event.pointerId);

    selectionInProgress.current = false;

    const { x, y } = getEventPosition(event.nativeEvent, containerBounds.current);

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

    if (!eventTargetIsContainer) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onPointerMove = (event: PointerEvent): void => {
    const {
      userSelectionRect,
      transform,
      nodeLookup,
      edgeLookup,
      connectionLookup,
      triggerNodeChanges,
      triggerEdgeChanges,
      defaultEdgeOptions,
      resetSelectedElements,
    } = store.getState();

    if (!containerBounds.current || !userSelectionRect) {
      return;
    }

    const { x: mouseX, y: mouseY } = getEventPosition(event.nativeEvent, containerBounds.current);
    const { startX, startY } = userSelectionRect;

    if (!selectionInProgress.current) {
      const requiredDistance = selectionKeyPressed ? 0 : paneClickDistance;
      const distance = Math.hypot(mouseX - startX, mouseY - startY);
      if (distance <= requiredDistance) {
        return;
      }
      resetSelectedElements();
      onSelectionStart?.(event);
    }

    selectionInProgress.current = true;

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
      const changes = getSelectionChanges(nodeLookup, selectedNodeIds.current, true);
      triggerNodeChanges(changes);
    }

    if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.current)) {
      const changes = getSelectionChanges(edgeLookup, selectedEdgeIds.current);
      triggerEdgeChanges(changes);
    }

    store.setState({
      userSelectionRect: nextUserSelectRect,
      userSelectionActive: true,
      nodesSelectionActive: false,
    });
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    (event.target as Partial<Element>)?.releasePointerCapture?.(event.pointerId);

    /*
     * We only want to trigger click functions when in selection mode if
     * the user did not move the mouse.
     */
    if (!userSelectionActive && event.target === container.current && store.getState().userSelectionRect) {
      onClick?.(event);
    }

    store.setState({
      userSelectionActive: false,
      userSelectionRect: null,
    });

    if (selectionInProgress.current) {
      onSelectionEnd?.(event);

      store.setState({
        nodesSelectionActive: selectedNodeIds.current.size > 0,
      });
    }
  };

  const draggable = panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0));

  return (
    <div
      className={cc(['react-flow__pane', { draggable, dragging, selection: isSelecting }])}
      onClick={isSelectionEnabled ? undefined : onClick}
      onContextMenu={onContextMenu}
      onWheel={onWheel}
      onPointerEnter={isSelectionEnabled ? undefined : onPaneMouseEnter}
      onPointerMove={isSelectionEnabled ? onPointerMove : onPaneMouseMove}
      onPointerUp={isSelectionEnabled ? onPointerUp : undefined}
      onPointerDownCapture={isSelectionEnabled ? onPointerDownCapture : undefined}
      onClickCapture={isSelectionEnabled ? onClickCapture : undefined}
      onPointerLeave={onPaneMouseLeave}
      ref={container}
      style={containerStyle}
    >
      {children}
      <UserSelection />
    </div>
  );
}
