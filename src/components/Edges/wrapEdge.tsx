import React, { memo, ComponentType, useCallback } from 'react';
import cc from 'classcat';

import { useStoreActions } from '../../store/hooks';
import { Edge, EdgeProps, WrapEdgeProps } from '../../types';
import { onMouseDown } from '../../components/Handle/BaseHandle';

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

    const inactive = !elementsSelectable && !onClick;
    const edgeClasses = cc([
      'react-flow__edge',
      `react-flow__edge-${type}`,
      className,
      { selected, animated, inactive },
    ]);

    const onEdgeClick = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        if (elementsSelectable) {
          addSelectedElements({ id, source, target });
        }

        if (onClick) {
          const edgeElement: Edge = { id, source, target, type };

          if (typeof data !== 'undefined') {
            edgeElement.data = data;
          }

          onClick(event, edgeElement);
        }
      },
      [elementsSelectable, id, source, target, type, data, onClick]
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
          isValidConnection
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

    if (isHidden) {
      return null;
    }

    return (
      <g className={edgeClasses} onClick={onEdgeClick}>
        {handleEdgeUpdate && (
          <g onMouseDown={onEdgeUpdaterSourceMouseDown}>
            <circle
              className="react-flow__edgeupdater"
              cx={sourceX}
              cy={sourceY}
              r="12"
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
        />
        {handleEdgeUpdate && (
          <g onMouseDown={onEdgeUpdaterTargetMouseDown}>
            <circle
              className="react-flow__edgeupdater"
              cx={targetX}
              cy={targetY}
              r="12"
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
