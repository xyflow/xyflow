import React, { memo, useMemo, ComponentType, CSSProperties, useCallback } from 'react';
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
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const edgeClasses = cc(['react-flow__edge', `react-flow__edge-${type}`, className, { selected, animated }]);

    const edgeGroupStyle: CSSProperties = useMemo(
      () => ({
        pointerEvents: elementsSelectable || onClick ? 'all' : 'none',
      }),
      [elementsSelectable, onClick]
    );

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

    const handleEitherEndOfEdgePress = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>, isEdgeHeader?: boolean): void => {
        if (elementsSelectable) {
          setSelectedElements({ id, source, target });
        }

        const edgeElement: Edge = { id, source, target, type };

        if (typeof data !== 'undefined') {
          edgeElement.data = data;
        }

        onEitherEndOfEdgePress(event, edgeElement, isEdgeHeader);
      },
      [elementsSelectable, id, source, target, type, data, onEitherEndOfEdgePress]
    );

    const handleEdgeHeaderPress = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEitherEndOfEdgePress(event, true);
      },
      [handleEitherEndOfEdgePress],
    );

    const handleEdgeFooterPress = useCallback(
      (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
        handleEitherEndOfEdgePress(event);
      },
      [handleEitherEndOfEdgePress],
    );

    if (isHidden) {
      return null;
    }

    return (
      <g className={edgeClasses} onClick={onEdgeClick} style={edgeGroupStyle}>
        <g onMouseDown={handleEdgeFooterPress}>
          <circle
            className="move-handler"
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
        <g onMouseDown={handleEdgeHeaderPress}>
          <circle
            className="move-handler"
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
