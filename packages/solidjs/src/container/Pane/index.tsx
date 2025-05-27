/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

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
import type { ReactFlowProps, SolidFlowState } from '../../types';
import { mergeProps, JSX, ParentProps } from 'solid-js';
import { useRef } from '../../utils/hooks';

type PaneProps = {
  isSelecting: boolean;
  selectionKeyPressed: boolean;
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

const wrapHandler = <T extends HTMLElement>(
  handler: ((event: MouseEvent) => void) | undefined,
  containerRef: { current: T | null }
): ((event: MouseEvent) => void) => {
  return (event: MouseEvent) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler?.(event);
  };
};

const selector = (s: SolidFlowState) => ({
  userSelectionActive: () => s.userSelectionActive.get(),
  elementsSelectable: () => s.elementsSelectable.get(),
  connectionInProgress: () => s.connection.get().inProgress,
  dragging: () => s.paneDragging.get(),
});

export function Pane(_p: ParentProps<PaneProps>) {
  const p = mergeProps(
    {
      selectionMode: SelectionMode.Full,
    } satisfies Partial<PaneProps>,
    _p
  );

  const store = useStoreApi();
  const storeData = useStore(selector);
  const hasActiveSelection = () => storeData.elementsSelectable() && (p.isSelecting || storeData.userSelectionActive());

  const container = useRef<HTMLDivElement | null>(null);
  const containerBounds = useRef<DOMRect | null>(null);

  const selectedNodeIds = useRef<Set<string>>(new Set());
  const selectedEdgeIds = useRef<Set<string>>(new Set());

  // Used to prevent click events when the user lets go of the selectionKey during a selection
  const selectionInProgress = useRef<boolean>(false);
  const selectionStarted = useRef<boolean>(false);

  const onClick = (event: MouseEvent) => {
    // We prevent click events when the user let go of the selectionKey during a selection
    // We also prevent click events when a connection is in progress
    if (selectionInProgress.current || storeData.connectionInProgress()) {
      selectionInProgress.current = false;
      return;
    }

    p.onPaneClick?.(event);
    store.resetSelectedElements();
    store.nodesSelectionActive.set(false);
  };

  const onContextMenu = (event: MouseEvent) => {
    if (Array.isArray(p.panOnDrag) && p.panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }

    p.onPaneContextMenu?.(event);
  };

  const onWheel = p.onPaneScroll ? (event: WheelEvent) => p.onPaneScroll!(event) : undefined;

  const onPointerDown = (event: PointerEvent): void => {
    const domNodeRect = store.domNode.get()?.getBoundingClientRect();
    if (!domNodeRect) {
      return;
    }
    containerBounds.current = domNodeRect;

    if (
      !storeData.elementsSelectable() ||
      !p.isSelecting ||
      event.button !== 0 ||
      event.target !== container.current ||
      !containerBounds.current
    ) {
      return;
    }

    (event.target as Partial<Element> | null)?.setPointerCapture?.(event.pointerId);

    selectionStarted.current = true;
    selectionInProgress.current = false;

    const { x, y } = getEventPosition(event, containerBounds.current);

    store.resetSelectedElements();

    store.userSelectionRect.set({
      width: 0,
      height: 0,
      startX: x,
      startY: y,
      x,
      y,
    });

    p.onSelectionStart?.(event);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!containerBounds.current || !store.userSelectionRect.get()) {
      return;
    }

    selectionInProgress.current = true;

    const { x: mouseX, y: mouseY } = getEventPosition(event, containerBounds.current);
    const userSelectionRect = store.userSelectionRect.get()!;
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
      getNodesInside(
        store.nodeLookup,
        nextUserSelectRect,
        store.transform.get(),
        p.selectionMode === SelectionMode.Partial,
        true
      ).map((node) => node.id)
    );

    selectedEdgeIds.current = new Set();
    const edgesSelectable = store.defaultEdgeOptions?.selectable ?? true;

    // We look for all edges connected to the selected nodes
    for (const nodeId of selectedNodeIds.current) {
      const connections = store.connectionLookup.get(nodeId);
      if (!connections) continue;
      for (const { edgeId } of connections.values()) {
        const edge = store.edgeLookup.get(edgeId);
        if (edge && (edge.selectable ?? edgesSelectable)) {
          selectedEdgeIds.current.add(edgeId);
        }
      }
    }

    if (!areSetsEqual(prevSelectedNodeIds, selectedNodeIds.current)) {
      const changes = getSelectionChanges(store.nodeLookup, selectedNodeIds.current, true) as NodeChange[];
      store.triggerNodeChanges(changes);
    }

    if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.current)) {
      const changes = getSelectionChanges(store.edgeLookup, selectedEdgeIds.current) as EdgeChange[];
      store.triggerEdgeChanges(changes);
    }

    store.userSelectionRect.set(nextUserSelectRect);
    store.userSelectionActive.set(true);
    store.nodesSelectionActive.set(false);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.button !== 0 || !selectionStarted.current) {
      return;
    }

    (event.target as Partial<Element>)?.releasePointerCapture?.(event.pointerId);
    const userSelectionRect = store.userSelectionRect.get();

    /*
     * We only want to trigger click functions when in selection mode if
     * the user did not move the mouse.
     */
    if (!storeData.userSelectionActive() && userSelectionRect && event.target === container.current) {
      onClick(event as any);
    }

    store.userSelectionActive.set(false);
    store.userSelectionRect.set(null);
    store.nodesSelectionActive.set(selectedNodeIds.current.size > 0);

    p.onSelectionEnd?.(event);

    /*
     * If the user kept holding the selectionKey during the selection,
     * we need to reset the selectionInProgress, so the next click event is not prevented
     */
    if (p.selectionKeyPressed || p.selectionOnDrag) {
      selectionInProgress.current = false;
    }

    selectionStarted.current = false;
  };

  const draggable = () => p.panOnDrag === true || (Array.isArray(p.panOnDrag) && p.panOnDrag.includes(0));

  const wrapWheelHandler = (
    handler: ((event: WheelEvent) => void) | undefined,
    containerRef: { current: HTMLDivElement | null }
  ): ((event: WheelEvent) => void) | undefined => {
    if (!handler) return undefined;
    return (event: WheelEvent) => {
      if (event.target !== containerRef.current) {
        return;
      }
      handler(event);
    };
  };

  return (
    <div
      class={cc([
        'react-flow__pane',
        { draggable: draggable(), dragging: storeData.dragging(), selection: p.isSelecting },
      ])}
      onClick={hasActiveSelection() ? undefined : wrapHandler(onClick, container)}
      onContextMenu={wrapHandler(onContextMenu, container)}
      onWheel={wrapWheelHandler(onWheel, container)}
      onPointerEnter={hasActiveSelection() ? undefined : p.onPaneMouseEnter}
      onPointerDown={hasActiveSelection() ? onPointerDown : p.onPaneMouseMove}
      onPointerMove={hasActiveSelection() ? onPointerMove : p.onPaneMouseMove}
      onPointerUp={hasActiveSelection() ? onPointerUp : undefined}
      onPointerLeave={p.onPaneMouseLeave}
      ref={(el) => (container.current = el)}
      style={containerStyle}
    >
      {p.children}
      <UserSelection />
    </div>
  );
}
