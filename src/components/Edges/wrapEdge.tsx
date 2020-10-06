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
  }: WrapEdgeProps) => {
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

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
          setSelectedElements({ id, source, target });
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

    if (isHidden) {
      return null;
    }

    return (
      <g className={edgeClasses} onClick={onEdgeClick}>
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
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
