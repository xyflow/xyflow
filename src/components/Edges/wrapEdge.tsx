import React, { memo, ComponentType, useCallback, useState, useMemo } from 'react';
import cc from 'classcat';

import { useStoreActions, useStoreState } from '../../store/hooks';
import { Edge, EdgeProps, WrapEdgeProps } from '../../types';
import { onMouseDown } from '../../components/Handle/handler';
import { EdgeAnchor } from './EdgeAnchor';

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
    arrowHeadType,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    elementsSelectable,
    markerEndId,
    isHidden,
    sourceHandleId,
    targetHandleId,
    handleEdgeUpdate,
    onConnectEdge,
    onContextMenu,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    edgeUpdaterRadius,
    onEdgeUpdateStart,
  }: WrapEdgeProps): JSX.Element | null => {
    const addSelectedElements = useStoreActions((actions) => actions.addSelectedElements);
    const setConnectionNodeId = useStoreActions((actions) => actions.setConnectionNodeId);
    const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
    const setPosition = useStoreActions((actions) => actions.setConnectionPosition);
    const connectionMode = useStoreState((state) => state.connectionMode);

    const [updating, setUpdating] = useState<boolean>(false);

    const inactive = !elementsSelectable && !onClick;
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
          unsetNodesSelection();
          addSelectedElements(edgeElement);
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

        onMouseDown(
          event,
          handleId,
          nodeId,
          setConnectionNodeId,
          setPosition,
          onConnectEdge,
          isTarget,
          isValidConnection,
          connectionMode
        );
      },
      [id, source, target, type, sourceHandleId, targetHandleId, setConnectionNodeId, setPosition, edgeElement]
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

    if (isHidden) {
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
          arrowHeadType={arrowHeadType}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          markerEndId={markerEndId}
          sourceHandleId={sourceHandleId}
          targetHandleId={targetHandleId}
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
