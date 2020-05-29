import React, { memo, ComponentType, CSSProperties } from 'react';
import cx from 'classnames';

import store from '../../store';
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
  isInteractive: boolean;
}

export default (EdgeComponent: ComponentType<EdgeCompProps>) => {
  const EdgeWrapper = memo(
    ({
      id,
      source,
      target,
      type,
      animated,
      selected,
      onClick,
      isInteractive,
      label,
      labelStyle,
      labelShowBg,
      labelBgStyle,
      className,
      ...rest
    }: EdgeWrapperProps) => {
      const edgeClasses = cx('react-flow__edge', `react-flow__edge-${type}`, className, { selected, animated });
      const edgeGroupStyle: CSSProperties = {
        pointerEvents: isInteractive ? 'all' : 'none',
      };
      const onEdgeClick = (): void => {
        if (!isInteractive) {
          return;
        }

        store.dispatch.setSelectedElements({ id, source, target });

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
            {...rest}
          />
        </g>
      );
    }
  );

  EdgeWrapper.displayName = 'EdgeWrapper';

  return EdgeWrapper;
};
