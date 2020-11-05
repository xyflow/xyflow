import React, { memo, ComponentType, useCallback } from 'react';
import cc from 'classcat';

import { useStoreActions } from '../../store/hooks';
import { Edge, EdgeProps, WrapEdgeProps } from '../../types';

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
    onEitherEndOfEdgePress,
  }: WrapEdgeProps) => {
    const addSelectedElements = useStoreActions((actions) => actions.addSelectedElements);

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

    const handleEdgeUpdaterMouseDown = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>, isEdgeHeader?: boolean): void => {
        if (elementsSelectable) {
          addSelectedElements({ id, source, target });
        }

        const edgeElement: Edge = { id, source, target, type };

        if (typeof data !== 'undefined') {
          edgeElement.data = data;
        }

        onEitherEndOfEdgePress(event, edgeElement, isEdgeHeader);
      },
      [elementsSelectable, id, source, target, type, data, onEitherEndOfEdgePress]
    );

    const handleEdgeTargetMouseDown = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEdgeUpdaterMouseDown(event, true);
      },
      [handleEdgeUpdaterMouseDown]
    );

    const handleEdgeSourceMouseDown = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEdgeUpdaterMouseDown(event);
      },
      [handleEdgeUpdaterMouseDown]
    );

    if (isHidden) {
      return null;
    }

    return (
      <g className={edgeClasses} onClick={onEdgeClick}>
        <g onMouseDown={handleEdgeSourceMouseDown}>
          <circle
            className="react-flow__edgeupdater"
            cx={sourceX}
            cy={sourceY}
            r="12"
            stroke="transparent"
            fill="transparent"
          />
        </g>
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
        <g onMouseDown={handleEdgeTargetMouseDown}>
          <circle
            className="react-flow__edgeupdater"
            cx={targetX}
            cy={targetY}
            r="12"
            stroke="transparent"
            fill="transparent"
          />
        </g>
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
