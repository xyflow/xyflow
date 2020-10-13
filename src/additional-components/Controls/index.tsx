import React, { memo } from 'react';
import cc from 'classcat';

import { useStoreState, useStoreActions } from '../../store/hooks';

import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import UnlockIcon from '../../../assets/icons/unlock.svg';

import './style.css';

export interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
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
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
}: ControlProps) => {
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const fitView = useStoreActions((actions) => actions.fitView);
  const zoomIn = useStoreActions((actions) => actions.zoomIn);
  const zoomOut = useStoreActions((actions) => actions.zoomOut);

  const isInteractive = useStoreState((s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable);
  const mapClasses = cc(['react-flow__controls', className]);

  return (
    <div className={mapClasses} style={style}>
      {showZoom && (
        <>
          <div className="react-flow__controls-button react-flow__controls-zoomin" onClick={() => {
            zoomIn();
            if (onZoomIn) {
              onZoomIn();
            }
          }}>
            <PlusIcon />
          </div>
          <div className="react-flow__controls-button react-flow__controls-zoomout" onClick={() => {
            zoomOut();
            if (onZoomOut) {
              onZoomOut();
            }
          }}>
            <MinusIcon />
          </div>
        </>
      )}
      {showFitView && (
        <div
          className="react-flow__controls-button react-flow__controls-fitview"
          onClick={() => {
            fitView({ padding: 0.1 });
            if (onFitView) {
              onFitView();
            }
          }}
        >
          <FitviewIcon />
        </div>
      )}
      {showInteractive && (
        <div
          className="react-flow__controls-button react-flow__controls-interactive"
          onClick={() => {
            setInteractive(!isInteractive);
            if (onInteractiveChange) {
              onInteractiveChange(!isInteractive);
            }
          }}
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </div>
      )}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
