import React, { memo, MouseEvent, ComponentType } from 'react';
import cx from 'classnames';

import { isInputDOMNode } from '../../utils';
import store from '../../store';
import { EdgeWrapperProps } from '../../types';

export default (EdgeComponent: ComponentType<EdgeWrapperProps>) => {
  const EdgeWrapper = memo(({
    id, source, target, type,
    animated, selected, onClick,
    ...rest
  }: EdgeWrapperProps) => {
    const edgeClasses = cx('react-flow__edge', { selected, animated });
    const onEdgeClick = (evt: MouseEvent) => {
      if (isInputDOMNode(evt)) {
        return false;
      }

      store.dispatch.setSelectedElements({ id, source, target });
      onClick({ id, source, target, type });
    };

    return (
      <g
        className={edgeClasses}
        onClick={onEdgeClick}
      >
        <EdgeComponent
          id={id}
          source={source}
          target={target}
          type={type}
          animated={animated}
          selected={selected}
          onClick={onClick}
          {...rest}
        />
      </g>
    );
  });

  EdgeWrapper.displayName = 'EdgeWrapper';

  return EdgeWrapper;
};
