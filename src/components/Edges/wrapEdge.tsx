import React, { memo, ComponentType, CSSProperties } from 'react';
import cc from 'classcat';

import { useStoreActions } from '../../store/hooks';
import { ElementId, Edge, EdgeCompProps } from '../../types';

interface EdgeWrapperProps {
  id: ElementId;
  source: ElementId;
  target: ElementId;
  type: any;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  className?: string;
  onClick?: (event: React.MouseEvent, edge: Edge) => void;
  animated?: boolean;
  selected: boolean;
  elementsSelectable: boolean;
  isHidden?: boolean;
  data?: any;
}

export default (EdgeComponent: ComponentType<EdgeCompProps>) => {
  const EdgeWrapper = ({
    id,
    source,
    target,
    type,
    animated,
    selected,
    onClick,
    elementsSelectable,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    className,
    isHidden,
    data,
    ...rest
  }: EdgeWrapperProps) => {
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    if (isHidden) {
      return null;
    }

    const edgeClasses = cc(['react-flow__edge', `react-flow__edge-${type}`, className, { selected, animated }]);
    const edgeGroupStyle: CSSProperties = {
      pointerEvents: elementsSelectable || onClick ? 'all' : 'none',
    };
    const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
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
    };

    return (
      <g className={edgeClasses} onClick={onEdgeClick} style={edgeGroupStyle}>
        <EdgeComponent
          id={id}
          source={source}
          target={target}
          type={type}
          animated={animated}
          selected={selected}
          onClick={onClick}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
          data={data}
          {...rest}
        />
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
