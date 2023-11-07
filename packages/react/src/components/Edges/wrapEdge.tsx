import { memo, useState, useMemo, useRef, type ComponentType, type KeyboardEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { getMarkerId, elementSelectionKeys, XYHandle, type Connection, getEdgePosition } from '@xyflow/system';

import { useStoreApi, useStore } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';
import { EdgeAnchor } from './EdgeAnchor';
import { getMouseHandler } from './utils';
import type { EdgeProps, WrapEdgeProps } from '../../types';

export default (EdgeComponent: ComponentType<EdgeProps>) => {
  const EdgeWrapper = ({
    id,
    className,
    type,
    data,
    onClick,
    onEdgeDoubleClick,
    selected,
    animated,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    source,
    target,
    isSelectable,
    hidden,
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
    markerEnd,
    markerStart,
    rfId,
    ariaLabel,
    isFocusable,
    isUpdatable,
    pathOptions,
    interactionWidth,
  }: WrapEdgeProps): JSX.Element | null => {
    const edgeRef = useRef<SVGGElement>(null);
    const [updateHover, setUpdateHover] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const store = useStoreApi();
    const edgePosition = useStore((state) => {
      const sourceNode = state.nodes.find((n) => n.id === source);
      const targetNode = state.nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode) {
        return null;
      }

      const pos = getEdgePosition({
        id,
        sourceNode,
        targetNode,
        sourceHandle: sourceHandleId || null,
        targetHandle: targetHandleId || null,
        connectionMode: state.connectionMode,
        onError: state.onError,
      });

      return pos;
    }, shallow);

    const markerStartUrl = useMemo(() => `url(#${getMarkerId(markerStart, rfId)})`, [markerStart, rfId]);
    const markerEndUrl = useMemo(() => `url(#${getMarkerId(markerEnd, rfId)})`, [markerEnd, rfId]);

    if (hidden || !edgePosition) {
      return null;
    }

    const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
      const { edges, addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
      const edge = edges.find((e) => e.id === id);

      if (!edge) {
        return;
      }

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

    const onEdgeDoubleClickHandler = getMouseHandler(id, store.getState, onEdgeDoubleClick);
    const onEdgeContextMenu = getMouseHandler(id, store.getState, onContextMenu);
    const onEdgeMouseEnter = getMouseHandler(id, store.getState, onMouseEnter);
    const onEdgeMouseMove = getMouseHandler(id, store.getState, onMouseMove);
    const onEdgeMouseLeave = getMouseHandler(id, store.getState, onMouseLeave);

    const handleEdgeUpdater = (event: React.MouseEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
      // avoid triggering edge updater if mouse btn is not left
      if (event.button !== 0) {
        return;
      }

      const {
        autoPanOnConnect,
        domNode,
        edges,
        isValidConnection,
        connectionMode,
        connectionRadius,
        lib,
        onConnectStart,
        onConnectEnd,
        cancelConnection,
        nodes,
        panBy,
        updateConnection,
      } = store.getState();
      const nodeId = isSourceHandle ? target : source;
      const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
      const handleType = isSourceHandle ? 'target' : 'source';

      const isTarget = isSourceHandle;
      const edge = edges.find((e) => e.id === id)!;

      setUpdating(true);
      onEdgeUpdateStart?.(event, edge, handleType);

      const _onEdgeUpdateEnd = (evt: MouseEvent | TouchEvent) => {
        setUpdating(false);
        onEdgeUpdateEnd?.(evt, edge, handleType);
      };

      const onConnectEdge = (connection: Connection) => onEdgeUpdate?.(edge, connection);

      XYHandle.onPointerDown(event.nativeEvent, {
        autoPanOnConnect,
        connectionMode,
        connectionRadius,
        domNode,
        handleId,
        nodeId,
        nodes,
        isTarget,
        edgeUpdaterType: handleType,
        lib,
        cancelConnection,
        panBy,
        isValidConnection,
        onConnect: onConnectEdge,
        onConnectStart,
        onConnectEnd,
        onEdgeUpdateEnd: _onEdgeUpdateEnd,
        updateConnection,
        getTransform: () => store.getState().transform,
      });
    };

    const onEdgeUpdaterSourceMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
      handleEdgeUpdater(event, true);
    const onEdgeUpdaterTargetMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
      handleEdgeUpdater(event, false);

    const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
    const onEdgeUpdaterMouseOut = () => setUpdateHover(false);

    const inactive = !isSelectable && !onClick;

    const onKeyDown = (event: KeyboardEvent) => {
      if (elementSelectionKeys.includes(event.key) && isSelectable) {
        const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
        const unselect = event.key === 'Escape';

        if (unselect) {
          edgeRef.current?.blur();
          unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id)!] });
        } else {
          addSelectedEdges([id]);
        }
      }
    };

    return (
      <g
        className={cc([
          'react-flow__edge',
          `react-flow__edge-${type}`,
          className,
          { selected, animated, inactive, updating: updateHover },
        ])}
        onClick={onEdgeClick}
        onDoubleClick={onEdgeDoubleClickHandler}
        onContextMenu={onEdgeContextMenu}
        onMouseEnter={onEdgeMouseEnter}
        onMouseMove={onEdgeMouseMove}
        onMouseLeave={onEdgeMouseLeave}
        onKeyDown={isFocusable ? onKeyDown : undefined}
        tabIndex={isFocusable ? 0 : undefined}
        role={isFocusable ? 'button' : 'img'}
        data-id={id}
        data-testid={`rf__edge-${id}`}
        aria-label={ariaLabel === null ? undefined : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`}
        aria-describedby={isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined}
        ref={edgeRef}
      >
        {!updating && (
          <EdgeComponent
            id={id}
            source={source}
            target={target}
            selected={selected}
            animated={animated}
            label={label}
            labelStyle={labelStyle}
            labelShowBg={labelShowBg}
            labelBgStyle={labelBgStyle}
            labelBgPadding={labelBgPadding}
            labelBgBorderRadius={labelBgBorderRadius}
            data={data}
            style={style}
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
            pathOptions={pathOptions}
            interactionWidth={interactionWidth}
          />
        )}
        {isUpdatable && (
          <>
            {(isUpdatable === 'source' || isUpdatable === true) && (
              <EdgeAnchor
                position={edgePosition.sourcePosition}
                centerX={edgePosition.sourceX}
                centerY={edgePosition.sourceY}
                radius={edgeUpdaterRadius}
                onMouseDown={onEdgeUpdaterSourceMouseDown}
                onMouseEnter={onEdgeUpdaterMouseEnter}
                onMouseOut={onEdgeUpdaterMouseOut}
                type="source"
              />
            )}
            {(isUpdatable === 'target' || isUpdatable === true) && (
              <EdgeAnchor
                position={edgePosition.targetPosition}
                centerX={edgePosition.targetX}
                centerY={edgePosition.targetY}
                radius={edgeUpdaterRadius}
                onMouseDown={onEdgeUpdaterTargetMouseDown}
                onMouseEnter={onEdgeUpdaterMouseEnter}
                onMouseOut={onEdgeUpdaterMouseOut}
                type="target"
              />
            )}
          </>
        )}
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
