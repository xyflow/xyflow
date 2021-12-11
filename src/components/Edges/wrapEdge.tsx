import React, { memo, ComponentType, useCallback, useState, useMemo } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Edge, EdgeProps, WrapEdgeProps, ReactFlowState, Connection } from '../../types';
import { onMouseDown } from '../../components/Handle/handler';
import { EdgeAnchor } from './EdgeAnchor';
import { getMarkerId } from '../../utils/graph';

const selector = (s: ReactFlowState) => ({
  addSelectedEdges: s.addSelectedEdges,
  connectionMode: s.connectionMode,
});

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
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    elementsSelectable,
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
  }: WrapEdgeProps): JSX.Element | null => {
    const store = useStoreApi();
    const { addSelectedEdges, connectionMode } = useStore(selector, shallow);

    const [updating, setUpdating] = useState<boolean>(false);

    const inactive = !elementsSelectable && !onClick;
    const handleEdgeUpdate = typeof onEdgeUpdate !== 'undefined';
    const edgeClasses = cc([
      'react-flow__edge',
      `react-flow__edge-${type}`,
      className,
      { selected, animated, inactive, updating },
    ]);

    const edgeElement = useMemo<Edge>(() => {
      const el: Edge = {
        id,
        source,
        target,
        type,
      };

      if (sourceHandleId) {
        el.sourceHandle = sourceHandleId;
      }

      if (targetHandleId) {
        el.targetHandle = targetHandleId;
      }

      if (typeof data !== 'undefined') {
        el.data = data;
      }

      return el;
    }, [id, source, target, type, sourceHandleId, targetHandleId, data]);

    const onEdgeClick = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        if (elementsSelectable) {
          store.setState({ nodesSelectionActive: false });
          addSelectedEdges([edgeElement.id]);
        }

        onClick?.(event, edgeElement);
      },
      [elementsSelectable, edgeElement, onClick]
    );

    const onEdgeDoubleClickHandler = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
        onEdgeDoubleClick?.(event, edgeElement);
      },
      [edgeElement, onEdgeDoubleClick]
    );

    const onEdgeContextMenu = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        onContextMenu?.(event, edgeElement);
      },
      [edgeElement, onContextMenu]
    );

    const onEdgeMouseEnter = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        onMouseEnter?.(event, edgeElement);
      },
      [edgeElement, onContextMenu]
    );

    const onEdgeMouseMove = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        onMouseMove?.(event, edgeElement);
      },
      [edgeElement, onContextMenu]
    );

    const onEdgeMouseLeave = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        onMouseLeave?.(event, edgeElement);
      },
      [edgeElement, onContextMenu]
    );

    const handleEdgeUpdater = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
        const nodeId = isSourceHandle ? target : source;
        const handleId = isSourceHandle ? targetHandleId : sourceHandleId;
        const isValidConnection = () => true;
        const isTarget = isSourceHandle;

        onEdgeUpdateStart?.(event, edgeElement);

        const _onEdgeUpdate = onEdgeUpdateEnd
          ? (evt: MouseEvent): void => onEdgeUpdateEnd(evt, edgeElement)
          : undefined;

        const onConnectEdge = (connection: Connection) => {
          const { edges } = store.getState();
          const edge = edges.find((e) => e.id === id);

          if (edge && onEdgeUpdate) {
            onEdgeUpdate(edge, connection);
          }
        };

        onMouseDown(
          event,
          handleId,
          nodeId,
          store.setState,
          onConnectEdge,
          isTarget,
          isValidConnection,
          connectionMode,
          isSourceHandle ? 'target' : 'source',
          _onEdgeUpdate,
          store.getState
        );
      },
      [id, source, target, type, sourceHandleId, targetHandleId, edgeElement, onEdgeUpdate]
    );

    const onEdgeUpdaterSourceMouseDown = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEdgeUpdater(event, true);
      },
      [id, source, sourceHandleId, handleEdgeUpdater]
    );

    const onEdgeUpdaterTargetMouseDown = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEdgeUpdater(event, false);
      },
      [id, target, targetHandleId, handleEdgeUpdater]
    );

    const onEdgeUpdaterMouseEnter = useCallback(() => setUpdating(true), [setUpdating]);
    const onEdgeUpdaterMouseOut = useCallback(() => setUpdating(false), [setUpdating]);
    const markerStartUrl = useMemo(() => `url(#${getMarkerId(markerStart)})`, [markerStart]);
    const markerEndUrl = useMemo(() => `url(#${getMarkerId(markerEnd)})`, [markerEnd]);

    if (hidden) {
      return null;
    }

    return (
      <g
        className={edgeClasses}
        onClick={onEdgeClick}
        onDoubleClick={onEdgeDoubleClickHandler}
        onContextMenu={onEdgeContextMenu}
        onMouseEnter={onEdgeMouseEnter}
        onMouseMove={onEdgeMouseMove}
        onMouseLeave={onEdgeMouseLeave}
      >
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
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          sourceHandleId={sourceHandleId}
          targetHandleId={targetHandleId}
          markerStart={markerStartUrl}
          markerEnd={markerEndUrl}
        />
        {handleEdgeUpdate && (
          <g
            onMouseDown={onEdgeUpdaterSourceMouseDown}
            onMouseEnter={onEdgeUpdaterMouseEnter}
            onMouseOut={onEdgeUpdaterMouseOut}
          >
            <EdgeAnchor position={sourcePosition} centerX={sourceX} centerY={sourceY} radius={edgeUpdaterRadius} />
          </g>
        )}
        {handleEdgeUpdate && (
          <g
            onMouseDown={onEdgeUpdaterTargetMouseDown}
            onMouseEnter={onEdgeUpdaterMouseEnter}
            onMouseOut={onEdgeUpdaterMouseOut}
          >
            <EdgeAnchor position={targetPosition} centerX={targetX} centerY={targetY} radius={edgeUpdaterRadius} />
          </g>
        )}
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
