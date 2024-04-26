// import { useState, useMemo, useRef, type KeyboardEvent, useCallback } from 'react';
import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';

import { useStoreApi, useStore } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';
import { builtinEdgeTypes, nullPosition } from './utils';
import { EdgeUpdateAnchors } from './EdgeUpdateAnchors';
import type { Edge, EdgeWrapperProps, SolidEvent } from '../../types';
import { Show, createMemo, createSignal, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useRef } from '../../utils/hooks';

export function EdgeWrapper<EdgeType extends Edge = Edge>(
  p: EdgeWrapperProps<EdgeType>

  //   {
  //   id,
  //   edgesFocusable,
  //   edgesUpdatable,
  //   elementsSelectable,
  //   onClick,
  //   onDoubleClick,
  //   onContextMenu,
  //   onMouseEnter,
  //   onMouseMove,
  //   onMouseLeave,
  //   edgeUpdaterRadius,
  //   onEdgeUpdate,
  //   onEdgeUpdateStart,
  //   onEdgeUpdateEnd,
  //   rfId,
  //   edgeTypes,
  //   noPanClassName,
  //   onError,
  //   disableKeyboardA11y,
  // }: EdgeWrapperProps<EdgeType>): JSX.Element | null {
) {
  const storeEdge = useStore((s) => () => {
    const edge = s.edgeLookup.get(p.id);
    if (!edge) {
      throw new Error(`Edge with id ${p.id} not found`);
    }
    return edge;
  }) as () => EdgeType;

  const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
  const edge = () => (defaultEdgeOptions ? { ...defaultEdgeOptions, ...storeEdge() } : storeEdge());

  const initialEdgeType = () => edge().type || 'default';
  const InitialEdgeComp = () => p.edgeTypes?.[initialEdgeType()] || builtinEdgeTypes[initialEdgeType()];

  const EdgeComponent = () => {
    const comp = InitialEdgeComp();
    if (comp === undefined) {
      p.onError?.('011', errorMessages['error011'](initialEdgeType()));
      return builtinEdgeTypes.default;
    } else {
      return comp;
    }
  };

  const edgeType = () => {
    if (InitialEdgeComp() === undefined) {
      return 'default';
    } else {
      return initialEdgeType();
    }
  };

  // if (EdgeComponent === undefined) {
  //   onError?.('011', errorMessages['error011'](edgeType));
  //   edgeType = 'default';
  //   EdgeComponent = builtinEdgeTypes.default;
  // }

  const isFocusable = () => !!(edge().focusable || (p.edgesFocusable && typeof edge().focusable === 'undefined'));
  const isReconnectable = () =>
    typeof p.onReconnect !== 'undefined' &&
    (edge().reconnectable || (p.edgesReconnectable && typeof edge().reconnectable === 'undefined'));
  const isSelectable = () =>
    !!(edge().selectable || (p.elementsSelectable && typeof edge().selectable === 'undefined'));

  const edgeRef = useRef<SVGGElement | null>(null);
  const [updateHover, setUpdateHover] = createSignal<boolean>(false);
  const [reconnecting, setReconnecting] = createSignal<boolean>(false);
  const store = useStoreApi();

  // const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
  const slice = createMemo(
    useStore(
      (store) => () => {
        const sourceNode = store.nodeLookup.get(edge().source);
        const targetNode = store.nodeLookup.get(edge().target);

        if (!sourceNode || !targetNode) {
          return {
            zIndex: edge().zIndex,
            ...nullPosition,
          };
        }

        const edgePosition = getEdgePosition({
          id: p.id,
          sourceNode,
          targetNode,
          sourceHandle: edge().sourceHandle || null,
          targetHandle: edge().targetHandle || null,
          connectionMode: store.connectionMode.get(),
          onError: p.onError,
        });

        const zIndex = getElevatedEdgeZIndex({
          selected: edge().selected,
          zIndex: edge().zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: store.elevateEdgesOnSelect.get(),
        });

        return {
          zIndex,
          ...(edgePosition || nullPosition),
        };
      }
      // [edge.source, edge.target, edge.sourceHandle, edge.targetHandle, edge.selected, edge.zIndex]
    )
  );

  const zIndex = () => slice().zIndex;
  const sourceX = () => slice().sourceX;
  const sourceY = () => slice().sourceY;
  const targetX = () => slice().targetX;
  const targetY = () => slice().targetY;
  const sourcePosition = () => slice().sourcePosition;
  const targetPosition = () => slice().targetPosition;

  const markerStartUrl = () => (edge().markerStart ? `url('#${getMarkerId(edge().markerStart, p.rfId)}')` : undefined);

  const markerEndUrl = () => (edge().markerEnd ? `url('#${getMarkerId(edge().markerEnd, p.rfId)}')` : undefined);

  const shouldShow = () => {
    if (edge().hidden || sourceX() === null || sourceY() === null || targetX() === null || targetY() === null) {
      return false;
    } else {
      return true;
    }
  };

  const onEdgeClick = (event: MouseEvent): void => {
    const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store;

    if (isSelectable()) {
      store.nodesSelectionActive.set(false);

      if (edge().selected && multiSelectionActive.get()) {
        unselectNodesAndEdges({ nodes: [], edges: [edge()] });
        edgeRef.current?.blur();
      } else {
        addSelectedEdges([p.id]);
      }
    }

    if (p.onClick) {
      p.onClick(event, edge());
    }
  };

  const onEdgeDoubleClick = (event: MouseEvent): void => {
    if (p.onDoubleClick) {
      p.onDoubleClick(event, { ...edge() });
    }
  };

  const onEdgeContextMenu = (event: MouseEvent): void => {
    if (p.onContextMenu) {
      p.onContextMenu(event, { ...edge() });
    }
  };

  const onEdgeMouseEnter = (event: MouseEvent): void => {
    if (p.onMouseEnter) {
      p.onMouseEnter(event, { ...edge() });
    }
  };

  const onEdgeMouseMove = (event: MouseEvent): void => {
    if (p.onMouseMove) {
      p.onMouseMove(event, { ...edge() });
    }
  };

  const onEdgeMouseLeave = (event: MouseEvent): void => {
    if (p.onMouseLeave) {
      p.onMouseLeave(event, { ...edge() });
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isFocusable()) {
      return;
    }

    if (!p.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable()) {
      const { unselectNodesAndEdges, addSelectedEdges } = store;
      const unselect = event.key === 'Escape';

      if (unselect) {
        edgeRef.current?.blur();
        unselectNodesAndEdges({ edges: [edge()] });
      } else {
        addSelectedEdges([p.id]);
      }
    }
  };

  const pathOptions = () => {
    const e = edge();
    return 'pathOptions' in e ? e.pathOptions : undefined;
  };

  return (
    <Show when={shouldShow()}>
      <svg style={{ 'z-index': zIndex() }}>
        <g
          class={cc([
            'react-flow__edge',
            `react-flow__edge-${edgeType()}`,
            edge().className,
            p.noPanClassName,
            {
              selected: edge().selected,
              animated: edge().animated,
              inactive: !isSelectable() && !p.onClick,
              updating: updateHover,
              selectable: isSelectable(),
            },
          ])}
          onClick={onEdgeClick}
          onDblClick={onEdgeDoubleClick}
          onContextMenu={onEdgeContextMenu}
          onMouseEnter={onEdgeMouseEnter}
          onMouseMove={onEdgeMouseMove}
          onMouseLeave={onEdgeMouseLeave}
          onKeyDown={onKeyDown}
          tabIndex={isFocusable() ? 0 : undefined}
          role={isFocusable() ? 'button' : 'img'}
          data-id={p.id}
          data-testid={`rf__edge-${p.id}`}
          aria-label={
            edge().ariaLabel === null ? undefined : edge().ariaLabel || `Edge from ${edge().source} to ${edge().target}`
          }
          aria-describedby={isFocusable() ? `${ARIA_EDGE_DESC_KEY}-${p.rfId}` : undefined}
          ref={(node) => (edgeRef.current = node)}
        >
          <Show when={!reconnecting()}>
            <Dynamic
              component={EdgeComponent()}
              id={p.id}
              source={edge().source}
              target={edge().target}
              type={edge().type}
              selected={edge().selected}
              animated={edge().animated}
              selectable={isSelectable()}
              deletable={edge().deletable ?? true}
              label={edge().label}
              labelStyle={edge().labelStyle}
              labelShowBg={edge().labelShowBg}
              labelBgStyle={edge().labelBgStyle}
              labelBgPadding={edge().labelBgPadding}
              labelBgBorderRadius={edge().labelBgBorderRadius}
              // TODO: fix these non-null assertions
              sourceX={sourceX()!}
              sourceY={sourceY()!}
              targetX={targetX()!}
              targetY={targetY()!}
              sourcePosition={sourcePosition()!}
              targetPosition={targetPosition()!}
              data={edge().data}
              style={edge().style}
              sourceHandleId={edge().sourceHandle}
              targetHandleId={edge().targetHandle}
              markerStart={markerStartUrl()}
              markerEnd={markerEndUrl()}
              pathOptions={pathOptions()}
              interactionWidth={edge().interactionWidth}
            />
          </Show>
          {/* )} */}
          <Show when={isReconnectable()}>
            <EdgeUpdateAnchors<EdgeType>
              edge={edge()}
              isReconnectable={isReconnectable()}
              reconnectRadius={p.reconnectRadius}
              onReconnect={p.onReconnect}
              onReconnectStart={p.onReconnectStart}
              onReconnectEnd={p.onReconnectEnd}
              // TODO: fix these non-null assertions
              sourceX={sourceX()!}
              sourceY={sourceY()!}
              targetX={targetX()!}
              targetY={targetY()!}
              sourcePosition={sourcePosition()!}
              targetPosition={targetPosition()!}
              setUpdateHover={setUpdateHover}
              setReconnecting={setReconnecting}
            />
            {/* )} */}
          </Show>
        </g>
      </svg>
    </Show>
  );
}
