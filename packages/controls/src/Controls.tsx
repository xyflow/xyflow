import { memo, useEffect, useState, type FC, type PropsWithChildren } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { useStore, useStoreApi, useReactFlow, Panel, type ReactFlowState } from '@reactflow/core';

import PlusIcon from './Icons/Plus';
import MinusIcon from './Icons/Minus';
import FitviewIcon from './Icons/FitView';
import LockIcon from './Icons/Lock';
import UnlockIcon from './Icons/Unlock';
import ControlButton from './ControlButton';

import type { ControlProps } from './types';

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
});

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
  position = 'bottom-left',
}) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(selector, shallow);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView(fitViewOptions);
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
    <Panel
      className={cc(['react-flow__controls', className])}
      position={position}
      style={style}
      data-testid="rf__controls"
    >
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomInHandler}
            className="react-flow__controls-zoomin"
            title="zoom in"
            aria-label="zoom in"
            disabled={maxZoomReached}
          >
            <PlusIcon />
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            className="react-flow__controls-zoomout"
            title="zoom out"
            aria-label="zoom out"
            disabled={minZoomReached}
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
    </Panel>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
