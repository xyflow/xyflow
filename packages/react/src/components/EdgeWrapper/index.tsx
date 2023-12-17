import { memo, useState, useMemo, useRef, type KeyboardEvent, useCallback } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { getMarkerId, elementSelectionKeys, getEdgePosition, errorMessages, getEdgeZIndex } from '@xyflow/system';

import { useStoreApi, useStore } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';
import type { EdgeWrapperProps, Node } from '../../types';
import { builtinEdgeTypes } from './utils';
import EdgeUpdateAnchors from './EdgeUpdateAnchors';

function EdgeWrapper({
  id,
  edgesFocusable,
  edgesUpdatable,
  elementsSelectable,
  onClick,
  onDoubleClick,
  sourceHandleId,
  targetHandleId,
  onContextMenu,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  edgeUpdaterRadius,
  onEdgeUpdate,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  rfId,
  edgeTypes,
  elevateEdgesOnSelect,
  noPanClassName,
  onError,
}: EdgeWrapperProps): JSX.Element | null {
  const edge = useStore((s) => s.edgeLookup.get(id)!);

  let edgeType = edge.type || 'default';
  let EdgeComponent = edgeTypes?.[edgeType] || builtinEdgeTypes[edgeType];

  if (EdgeComponent === undefined) {
    onError?.('011', errorMessages['error011'](edgeType));
    edgeType = 'default';
    EdgeComponent = builtinEdgeTypes.default;
  }

  const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
  const isUpdatable =
    typeof onEdgeUpdate !== 'undefined' &&
    (edge.updatable || (edgesUpdatable && typeof edge.updatable === 'undefined'));
  const isSelectable = !!(edge.selectable || (elementsSelectable && typeof edge.selectable === 'undefined'));

  const edgeRef = useRef<SVGGElement>(null);
  const [updateHover, setUpdateHover] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const store = useStoreApi();
  const prevSourceNode = useRef<Node | undefined>();
  const prevTargetNode = useRef<Node | undefined>();
  const prevZIndex = useRef<number | undefined>(edge.zIndex);
  const prevEdgePosition = useRef<ReturnType<typeof getEdgePosition> | null>(null);

  const { edgePosition, zIndex } = useStore(
    useCallback(
      (state) => {
        const sourceNode = state.nodeLookup.get(edge.source);
        const targetNode = state.nodeLookup.get(edge.target);

        if (!sourceNode || !targetNode) {
          return { edgePosition: null, zIndex: edge.zIndex };
        }

        const nodesChanged = prevSourceNode.current !== sourceNode || prevTargetNode.current !== targetNode;

        prevSourceNode.current = sourceNode;
        prevTargetNode.current = targetNode;

        prevEdgePosition.current = nodesChanged
          ? getEdgePosition({
              id,
              sourceNode,
              targetNode,
              sourceHandle: sourceHandleId || null,
              targetHandle: targetHandleId || null,
              connectionMode: state.connectionMode,
              onError: state.onError,
            })
          : prevEdgePosition.current;
        prevZIndex.current = getEdgeZIndex(edge.selected, edge.zIndex, sourceNode, targetNode, elevateEdgesOnSelect);

        return {
          edgePosition: prevEdgePosition.current,
          zIndex: prevZIndex.current,
        };
      },
      [edge.source, edge.target, edge.selected, edge.zIndex]
    ),
    shallow
  );

  const markerStartUrl = useMemo(
    () => (edge.markerStart ? `url(#${getMarkerId(edge.markerStart, rfId)})` : undefined),
    [edge.markerStart, rfId]
  );
  const markerEndUrl = useMemo(
    () => (edge.markerEnd ? `url(#${getMarkerId(edge.markerEnd, rfId)})` : undefined),
    [edge.markerEnd, rfId]
  );

  if (edge.hidden || !edgePosition) {
    return null;
  }

  const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();

    if (isSelectable) {
      store.setState({ nodesSelectionActive: false });

      if (edge.selected && multiSelectionActive) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
        edgeRef.current?.blur();
      } else {
        addSelectedEdges([id]);
      }
    }

    if (onClick) {
      onClick(event, edge);
    }
  };

  const onEdgeDoubleClick = onDoubleClick
    ? (event: React.MouseEvent) => {
        onDoubleClick(event, { ...edge });
      }
    : undefined;
  const onEdgeContextMenu = onContextMenu
    ? (event: React.MouseEvent) => {
        onContextMenu(event, { ...edge });
      }
    : undefined;
  const onEdgeMouseEnter = onMouseEnter
    ? (event: React.MouseEvent) => {
        onMouseEnter(event, { ...edge });
      }
    : undefined;
  const onEdgeMouseMove = onMouseMove
    ? (event: React.MouseEvent) => {
        onMouseMove(event, { ...edge });
      }
    : undefined;
  const onEdgeMouseLeave = onMouseLeave
    ? (event: React.MouseEvent) => {
        onMouseLeave(event, { ...edge });
      }
    : undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    if (elementSelectionKeys.includes(event.key) && isSelectable) {
      const { unselectNodesAndEdges, addSelectedEdges } = store.getState();
      const unselect = event.key === 'Escape';

      if (unselect) {
        edgeRef.current?.blur();
        unselectNodesAndEdges({ edges: [edge] });
      } else {
        addSelectedEdges([id]);
      }
    }
  };

  return (
    <svg style={{ zIndex }}>
      <g
        className={cc([
          'react-flow__edge',
          `react-flow__edge-${edgeType}`,
          edge.className,
          noPanClassName,
          {
            selected: edge.selected,
            animated: edge.animated,
            inactive: !isSelectable && !onClick,
            updating: updateHover,
          },
        ])}
        onClick={onEdgeClick}
        onDoubleClick={onEdgeDoubleClick}
        onContextMenu={onEdgeContextMenu}
        onMouseEnter={onEdgeMouseEnter}
        onMouseMove={onEdgeMouseMove}
        onMouseLeave={onEdgeMouseLeave}
        onKeyDown={isFocusable ? onKeyDown : undefined}
        tabIndex={isFocusable ? 0 : undefined}
        role={isFocusable ? 'button' : 'img'}
        data-id={id}
        data-testid={`rf__edge-${id}`}
        aria-label={
          edge.ariaLabel === null ? undefined : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`
        }
        aria-describedby={isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined}
        ref={edgeRef}
      >
        {!updating && (
          <EdgeComponent
            id={id}
            source={edge.source}
            target={edge.target}
            selected={edge.selected}
            animated={edge.animated}
            label={edge.label}
            labelStyle={edge.labelStyle}
            labelShowBg={edge.labelShowBg}
            labelBgStyle={edge.labelBgStyle}
            labelBgPadding={edge.labelBgPadding}
            labelBgBorderRadius={edge.labelBgBorderRadius}
            data={edge.data}
            style={edge.style}
            sourceX={edgePosition.sourceX}
            sourceY={edgePosition.sourceY}
            targetX={edgePosition.targetX}
            targetY={edgePosition.targetY}
            sourcePosition={edgePosition.sourcePosition}
            targetPosition={edgePosition.targetPosition}
            sourceHandleId={sourceHandleId}
            targetHandleId={targetHandleId}
            markerStart={markerStartUrl}
            markerEnd={markerEndUrl}
            pathOptions={'pathOptions' in edge ? edge.pathOptions : undefined}
            interactionWidth={edge.interactionWidth}
          />
        )}
        {isUpdatable && (
          <EdgeUpdateAnchors
            edge={edge}
            isUpdatable={isUpdatable}
            edgeUpdaterRadius={edgeUpdaterRadius}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            edgePosition={edgePosition}
            setUpdateHover={setUpdateHover}
            setUpdating={setUpdating}
            sourceHandleId={sourceHandleId}
            targetHandleId={targetHandleId}
          />
        )}
      </g>
    </svg>
  );
}

EdgeWrapper.displayName = 'EdgeWrapper';

export default memo(EdgeWrapper);
