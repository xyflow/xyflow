/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import { memo, useRef, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import UserSelection from '../../components/UserSelection';
import { containerStyle } from '../../styles';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils/changes';
import { getConnectedEdges, getNodesInside } from '../../utils/graph';
import { getEventPosition } from '../../utils';
import { SelectionMode } from '../../types';
import type { ReactFlowProps, ReactFlowState, NodeChange, EdgeChange } from '../../types';

type PaneProps = {
  isSelecting: boolean;
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

const Pane = memo(
  ({
    isSelecting,
    selectionMode = SelectionMode.Full,
    panOnDrag,
    onSelectionStart,
    onSelectionEnd,
    onPaneClick,
    onPaneContextMenu,
    onPaneScroll,
    onPaneMouseEnter,
    onPaneMouseMove,
    onPaneMouseLeave,
    children,
  }: PaneProps) => {
    const container = useRef<HTMLDivElement | null>(null);
    const store = useStoreApi();
    const prevSelectedNodesCount = useRef<number>(0);
    const prevSelectedEdgesCount = useRef<number>(0);
    const containerBounds = useRef<DOMRect>();
    const { userSelectionActive, elementsSelectable, dragging } = useStore(selector, shallow);

    const resetUserSelection = () => {
      store.setState({ userSelectionActive: false, userSelectionRect: null });

      prevSelectedNodesCount.current = 0;
      prevSelectedEdgesCount.current = 0;
    };

    const onClick = (event: ReactMouseEvent) => {
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

    const onMouseDown = (event: ReactMouseEvent): void => {
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

      const { x, y } = getEventPosition(event, containerBounds.current);

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

    const onMouseMove = (event: ReactMouseEvent): void => {
      const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin, getNodes } =
        store.getState();
      if (!isSelecting || !containerBounds.current || !userSelectionRect) {
        return;
      }

      store.setState({ userSelectionActive: true, nodesSelectionActive: false });

      const mousePos = getEventPosition(event, containerBounds.current);
      const startX = userSelectionRect.startX ?? 0;
      const startY = userSelectionRect.startY ?? 0;

      const nextUserSelectRect = {
        ...userSelectionRect,
        x: mousePos.x < startX ? mousePos.x : startX,
        y: mousePos.y < startY ? mousePos.y : startY,
        width: Math.abs(mousePos.x - startX),
        height: Math.abs(mousePos.y - startY),
      };

      const nodes = getNodes();
      const selectedNodes = getNodesInside(
        nodeInternals,
        nextUserSelectRect,
        transform,
        selectionMode === SelectionMode.Partial,
        true,
        nodeOrigin
      );
      const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
      const selectedNodeIds = selectedNodes.map((n) => n.id);

      if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
        prevSelectedNodesCount.current = selectedNodeIds.length;
        const changes = getSelectionChanges(nodes, selectedNodeIds) as NodeChange[];
        if (changes.length) {
          onNodesChange?.(changes);
        }
      }

      if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
        prevSelectedEdgesCount.current = selectedEdgeIds.length;
        const changes = getSelectionChanges(edges, selectedEdgeIds) as EdgeChange[];
        if (changes.length) {
          onEdgesChange?.(changes);
        }
      }

      store.setState({
        userSelectionRect: nextUserSelectRect,
      });
    };

    const onMouseUp = (event: ReactMouseEvent) => {
      if (event.button !== 0) {
        return;
      }
      const { userSelectionRect } = store.getState();
      // We only want to trigger click functions when in selection mode if
      // the user did not move the mouse.
      if (!userSelectionActive && userSelectionRect && event.target === container.current) {
        onClick?.(event);
      }

      store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });

      resetUserSelection();
      onSelectionEnd?.(event);
    };

    const onMouseLeave = (event: ReactMouseEvent) => {
      if (userSelectionActive) {
        store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
        onSelectionEnd?.(event);
      }

      resetUserSelection();
    };

    const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);

    return (
      <div
        className={cc(['react-flow__pane', { dragging, selection: isSelecting }])}
        onClick={hasActiveSelection ? undefined : wrapHandler(onClick, container)}
        onContextMenu={wrapHandler(onContextMenu, container)}
        onWheel={wrapHandler(onWheel, container)}
        onMouseEnter={hasActiveSelection ? undefined : onPaneMouseEnter}
        onMouseDown={hasActiveSelection ? onMouseDown : undefined}
        onMouseMove={hasActiveSelection ? onMouseMove : onPaneMouseMove}
        onMouseUp={hasActiveSelection ? onMouseUp : undefined}
        onMouseLeave={hasActiveSelection ? onMouseLeave : onPaneMouseLeave}
        ref={container}
        style={containerStyle}
      >
        {children}
        <UserSelection />
      </div>
    );
  }
);

Pane.displayName = 'Pane';

export default Pane;
