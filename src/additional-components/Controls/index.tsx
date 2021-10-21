import React, { memo, useCallback, HTMLAttributes, FC, useEffect, useState } from 'react';
import cc from 'classcat';

import { useStoreState, useStoreActions } from '../../store/hooks';

import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import UnlockIcon from '../../../assets/icons/unlock.svg';

import useZoomPanHelper from '../../hooks/useZoomPanHelper';
import { FitViewParams } from '../../types';

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewParams?: FitViewParams;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

export interface ControlButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const ControlButton: FC<ControlButtonProps> = ({ children, className, ...rest }) => (
  <button type="button" className={cc(['react-flow__controls-button', className])} {...rest}>
    {children}
  </button>
);

const Controls: FC<ControlProps> = ({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewParams,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();

  const isInteractive = useStoreState((s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable);
  const mapClasses = cc(['react-flow__controls', className]);

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    fitView?.(fitViewParams);
    onFitView?.();
  }, [fitView, fitViewParams, onFitView]);

  const onInteractiveChangeHandler = useCallback(() => {
    setInteractive?.(!isInteractive);
    onInteractiveChange?.(!isInteractive);
  }, [isInteractive, setInteractive, onInteractiveChange]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={mapClasses} style={style}>
      {showZoom && (
        <>
          <ControlButton onClick={onZoomInHandler} className="react-flow__controls-zoomin">
            <PlusIcon />
          </ControlButton>
          <ControlButton onClick={onZoomOutHandler} className="react-flow__controls-zoomout">
            <MinusIcon />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton className="react-flow__controls-fitview" onClick={onFitViewHandler}>
          <FitviewIcon />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton className="react-flow__controls-interactive" onClick={onInteractiveChangeHandler}>
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      )}
      {children}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
