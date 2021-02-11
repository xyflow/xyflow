import React, { memo, useCallback } from 'react';
import cc from 'classcat';

import { useStoreState, useStoreActions } from '../../store/hooks';

import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import UnlockIcon from '../../../assets/icons/unlock.svg';

import useZoomPanHelper from '../../hooks/useZoomPanHelper';
import { FitViewParams } from '../../types';

export interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewParams?: FitViewParams;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

const Controls = ({
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
}: ControlProps) => {
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

  return (
    <div className={mapClasses} style={style}>
      {showZoom && (
        <>
          <div className="react-flow__controls-button react-flow__controls-zoomin" onClick={onZoomInHandler}>
            <PlusIcon />
          </div>
          <div className="react-flow__controls-button react-flow__controls-zoomout" onClick={onZoomOutHandler}>
            <MinusIcon />
          </div>
        </>
      )}
      {showFitView && (
        <div className="react-flow__controls-button react-flow__controls-fitview" onClick={onFitViewHandler}>
          <FitviewIcon />
        </div>
      )}
      {showInteractive && (
        <div
          className="react-flow__controls-button react-flow__controls-interactive"
          onClick={onInteractiveChangeHandler}
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </div>
      )}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
