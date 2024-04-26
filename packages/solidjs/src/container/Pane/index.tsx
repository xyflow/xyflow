/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import cc from 'classcat';
import { getNodesInside, getEventPosition, SelectionMode, type NodeChange, type EdgeChange } from '@xyflow/system';

import { UserSelection } from '../../components/UserSelection';
import { containerStyle } from '../../styles/utils';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils';
import type { ReactFlowProps, SolidEvent, SolidFlowState } from '../../types';
import { mergeProps, JSX, ParentProps, batch, createEffect } from 'solid-js';
import { useRef, RefObject } from '../../utils/hooks';

type PaneProps = {
  isSelecting: boolean;
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
  >
>;

const wrapHandler = <T, E extends Event>(
  handler: ((event: SolidEvent<T, E>) => void) | undefined,
  containerRef: RefObject<T | null>
): ((event: SolidEvent<T, E>) => void) => {
  return (event: E) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler?.(event as SolidEvent<T, E>);
  };
};

const selector = (s: SolidFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
  dragging: s.paneDragging,
});

export function Pane(_p: ParentProps<PaneProps>) {
  //   {
  //   isSelecting,
  //   selectionMode = SelectionMode.Full,
  //   panOnDrag,
  //   onSelectionStart,
  //   onSelectionEnd,
  //   onPaneClick,
  //   onPaneContextMenu,
  //   onPaneScroll,
  //   onPaneMouseEnter,
  //   onPaneMouseMove,
  //   onPaneMouseLeave,
  //   children,
  // }: PaneProps) {

  const p = mergeProps(
    {
      selectionMode: SelectionMode.Full,
    },
    _p
  );

  const container = useRef<HTMLDivElement | null>(null);
  const store = useStoreApi();
  const prevSelectedNodesCount = useRef<number>(0);
  const prevSelectedEdgesCount = useRef<number>(0);
  const containerBounds = useRef<DOMRect | null>(null);
  const edgeIdLookup = useRef<Map<string, Set<string>>>(new Map());

  const { userSelectionActive, elementsSelectable, dragging } = useStore(selector);

  const resetUserSelection = () => {
    store.batch((store) => {
      store.userSelectionActive.set(false);
      store.userSelectionRect.set(null);
    });

    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };

  const onClick = (event: MouseEvent) => {
    batch(() => {
      p.onPaneClick?.(event);
      store.resetSelectedElements();
      store.nodesSelectionActive.set(false);
    });
  };

  const onContextMenu = (event: MouseEvent) => {
    if (Array.isArray(p.panOnDrag) && p.panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }

    p.onPaneContextMenu?.(event);
  };

  const onWheel = () => (p.onPaneScroll ? (event: WheelEvent) => p.onPaneScroll?.(event) : undefined);

  const onMouseDown = (event: MouseEvent): void => {
    console.log("mouse down")
    batch(() => {
      const { resetSelectedElements, domNode, edgeLookup } = store;
      containerBounds.current = domNode.get()?.getBoundingClientRect() ?? null;

      if (
        !elementsSelectable.get() ||
        !p.isSelecting ||
        event.button !== 0 ||
        event.target !== container.current ||
        !containerBounds.current
      ) {
        console.log("returning from mouse down")
        return;
      }

      edgeIdLookup.current = new Map();

      for (const [id, edge] of edgeLookup) {
        edgeIdLookup.current.set(edge.source, edgeIdLookup.current.get(edge.source)?.add(id) || new Set([id]));
        edgeIdLookup.current.set(edge.target, edgeIdLookup.current.get(edge.target)?.add(id) || new Set([id]));
      }

      const { x, y } = getEventPosition(event, containerBounds.current);

      resetSelectedElements();

      console.log("setting user selection rect")
      store.userSelectionRect.set({
        width: 0,
        height: 0,
        startX: x,
        startY: y,
        x,
        y,
      });

      p.onSelectionStart?.(event);
    });
  };

  const onMouseMove = (event: MouseEvent): void => {
    batch(() => {
      const { edgeLookup, transform, nodeOrigin, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = store;

      const userSelectionRect = store.userSelectionRect.get();

      if (!p.isSelecting || !containerBounds.current || !userSelectionRect) {
        return;
      }

      const { x: mouseX, y: mouseY } = getEventPosition(event, containerBounds.current);
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
        transform.get(),
        p.selectionMode === SelectionMode.Partial,
        true,
        nodeOrigin.get()
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
        const changes = getSelectionChanges(nodeLookup, selectedNodeIds) as NodeChange[];
        triggerNodeChanges(changes);
      }

      if (prevSelectedEdgesCount.current !== selectedEdgeIds.size) {
        prevSelectedEdgesCount.current = selectedEdgeIds.size;
        const changes = getSelectionChanges(edgeLookup, selectedEdgeIds) as EdgeChange[];
        triggerEdgeChanges(changes);
      }

      store.batch((store) => {
        store.userSelectionRect.set(nextUserSelectRect);
        store.userSelectionActive.set(true);
        store.nodesSelectionActive.set(false);
      });
    });
  };

  const onMouseUp = (event: MouseEvent) => {
    batch(() => {
      if (event.button !== 0) {
        return;
      }
      const { userSelectionRect } = store;
      // We only want to trigger click functions when in selection mode if
      // the user did not move the mouse.
      if (!userSelectionActive.get() && userSelectionRect.get() && event.target === container.current) {
        onClick?.(event);
      }

      store.nodesSelectionActive.set(prevSelectedNodesCount.current > 0);

      resetUserSelection();
      p.onSelectionEnd?.(event);
    });
  };

  const onMouseLeave = (event: MouseEvent) => {
    if (userSelectionActive.get()) {
      store.nodesSelectionActive.set(prevSelectedNodesCount.current > 0);
      p.onSelectionEnd?.(event);
    }

    resetUserSelection();
  };

  const hasActiveSelection = () => elementsSelectable.get() && (p.isSelecting || userSelectionActive.get());

  createEffect(() => { 
    console.log("elements selectable", elementsSelectable.get());
    console.log("is selecting", p.isSelecting);
    console.log("user selection active", userSelectionActive.get());
  })

  const handleClick = () => {
    if (hasActiveSelection()) {
      // do nothing
    } else {
      wrapHandler(onClick, container);
    }
  };

  const handleMouseEnter: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (e) => {
    if (hasActiveSelection()) {
      // do nothing
    } else {
      p.onPaneMouseEnter?.(e);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (hasActiveSelection()) {
      onMouseDown(e);
    } else {
      // do nothing
    }
  };

  const onPaneMouseMove = (e: MouseEvent) => {
    if (hasActiveSelection()) {
      onMouseMove(e);
    } else {
      p.onPaneMouseMove?.(e);
    }
  };

  const onPaneMouseLeave = (e: MouseEvent) => {
    if (hasActiveSelection()) {
      onMouseLeave(e);
    } else {
      p.onPaneMouseLeave?.(e);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (hasActiveSelection()) {
      onMouseUp(e);
    } else {
      // do nothing
    }
  };

  return (
    <div
      class={cc(['react-flow__pane', { draggable: p.panOnDrag, dragging: dragging.get(), selection: p.isSelecting }])}
      onClick={handleClick}
      onContextMenu={wrapHandler(onContextMenu, container)}
      onWheel={wrapHandler(onWheel(), container)}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseMove={onPaneMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={onPaneMouseLeave}
      ref={(node) => (container.current = node)}
      style={containerStyle}
    >
      {p.children}
      <UserSelection />
    </div>
  );
}
