import React, { memo, ComponentType, useCallback, useState } from 'react';
import cc from 'classcat';

import { useStoreActions, useStoreState } from '../../store/hooks';
import { Edge, EdgeProps, WrapEdgeProps } from '../../types';
import { onMouseDown } from '../../components/Handle/handler';

export default (EdgeComponent: ComponentType<EdgeProps>) => {
  const EdgeWrapper = ({
    id,
    className,
    type,
    data,
    onClick,
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
  }: WrapEdgeProps) => {
    const addSelectedElements = useStoreActions((actions) => actions.addSelectedElements);
    const setConnectionNodeId = useStoreActions((actions) => actions.setConnectionNodeId);
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

    const onEdgeClick = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        const edgeElement: Edge = {
          id,
          source,
          target,
          type,
        };

        if (sourceHandleId) {
          edgeElement.sourceHandle = sourceHandleId;
        }

        if (targetHandleId) {
          edgeElement.targetHandle = targetHandleId;
        }

        if (typeof data !== 'undefined') {
          edgeElement.data = data;
        }

        if (elementsSelectable) {
          addSelectedElements(edgeElement);
        }

        onClick?.(event, edgeElement);
      },
      [elementsSelectable, id, source, target, type, data, sourceHandleId, targetHandleId, onClick]
    );

    const handleEdgeUpdater = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
        const nodeId = isSourceHandle ? target : source;
        const handleId = isSourceHandle ? targetHandleId : sourceHandleId;
        const isValidConnection = () => true;
        const isTarget = isSourceHandle;

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
      [id, source, target, type, sourceHandleId, targetHandleId, setConnectionNodeId, setPosition]
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
      <g className={edgeClasses} onClick={onEdgeClick}>
        {handleEdgeUpdate && (
          <g
            onMouseDown={onEdgeUpdaterSourceMouseDown}
            onMouseEnter={onEdgeUpdaterMouseEnter}
            onMouseOut={onEdgeUpdaterMouseOut}
          >
            <circle
              className="react-flow__edgeupdater"
              cx={sourceX}
              cy={sourceY}
              r={10}
              stroke="transparent"
              fill="transparent"
            />
          </g>
        )}
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
            onMouseDown={onEdgeUpdaterTargetMouseDown}
            onMouseEnter={onEdgeUpdaterMouseEnter}
            onMouseOut={onEdgeUpdaterMouseOut}
          >
            <circle
              className="react-flow__edgeupdater"
              cx={targetX}
              cy={targetY}
              r={10}
              stroke="transparent"
              fill="transparent"
            />
          </g>
        )}
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
