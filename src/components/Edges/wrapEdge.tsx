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
  labelBgStyle: CSSProperties;
  className?: string;
  onClick?: (edge: Edge) => void;
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
    className,
    isHidden,
    data,
    ...rest
  }: EdgeWrapperProps) => {
    const setSelectedElements = useStoreActions((a) => a.setSelectedElements);

    if (isHidden) {
      return null;
    }

    const edgeClasses = cc(['react-flow__edge', `react-flow__edge-${type}`, className, { selected, animated }]);
    const edgeGroupStyle: CSSProperties = {
      pointerEvents: elementsSelectable ? 'all' : 'none',
    };
    const onEdgeClick = (): void => {
      if (!elementsSelectable) {
        return;
      }

      setSelectedElements({ id, source, target });

      if (onClick) {
        onClick({ id, source, target, type });
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
          data={data}
          {...rest}
        />
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
