import React from 'react';
import classnames from 'classnames';

import { fitView, zoomIn, zoomOut } from '../../utils/graph';
import { useStoreState, useStoreActions } from '../../store/hooks';

import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import UnlockIcon from '../../../assets/icons/unlock.svg';

import './style.css';

interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
}

const Controls = ({ style, showZoom = true, showFitView = true, showInteractive = true, className }: ControlProps) => {
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const isInteractive = useStoreState((s) => s.isInteractive);
  const mapClasses = classnames('react-flow__controls', className);

  return (
    <div className={mapClasses} style={style}>
      {showZoom && (
        <>
          <div className="react-flow__controls-button react-flow__controls-zoomin" onClick={zoomIn}>
            <PlusIcon />
          </div>
          <div className="react-flow__controls-button react-flow__controls-zoomout" onClick={zoomOut}>
            <MinusIcon />
          </div>
        </>
      )}
      {showFitView && (
        <div className="react-flow__controls-button react-flow__controls-fitview" onClick={() => fitView()}>
          <FitviewIcon />
        </div>
      )}
      {showInteractive && (
        <div
          className="react-flow__controls-button react-flow__controls-interactive"
          onClick={() => setInteractive(!isInteractive)}
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </div>
      )}
    </div>
  );
};

Controls.displayName = 'Controls';

export default Controls;
