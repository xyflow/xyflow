import React, { memo, FC, useEffect, useState, PropsWithChildren } from 'react';
import cc from 'classcat';

import { useStore, useStoreApi } from '../../store';
import useReactFlow from '../../hooks/useReactFlow';

import PlusIcon from './Icons/Plus';
import MinusIcon from './Icons/Minus';
import FitviewIcon from './Icons/FitView';
import LockIcon from './Icons/Lock';
import UnlockIcon from './Icons/Unlock';

import { ControlProps, ControlButtonProps, ReactFlowState } from '../../types';

export const ControlButton: FC<PropsWithChildren<ControlButtonProps>> = ({ children, className, ...rest }) => (
  <button type="button" className={cc(['react-flow__controls-button', className])} {...rest}>
    {children}
  </button>
);

const isInteractiveSelector = (s: ReactFlowState) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;

const Controls: FC<PropsWithChildren<ControlProps>> = ({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isInteractive = useStore(isInteractiveSelector);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  const onZoomInHandler = () => {
    zoomIn?.();
    onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut?.();
    onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView?.(fitViewOptions);
    onFitView?.();
  };

  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });

    onInteractiveChange?.(!isInteractive);
  };

  return (
    <div className={cc(['react-flow__controls', className])} style={style}>
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomInHandler}
            className="react-flow__controls-zoomin"
            title="zoom in"
            aria-label="zoom in"
          >
            <PlusIcon />
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            className="react-flow__controls-zoomout"
            title="zoom out"
            aria-label="zoom out"
          >
            <MinusIcon />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton
          className="react-flow__controls-fitview"
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <FitviewIcon />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton
          className="react-flow__controls-interactive"
          onClick={onToggleInteractivity}
          title="toggle interactivity"
          aria-label="toggle interactivity"
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      )}
      {children}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
