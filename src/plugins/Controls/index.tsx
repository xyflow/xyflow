import React, { CSSProperties } from 'react';
import classnames from 'classnames';

import { fitView, zoomIn, zoomOut } from '../../utils/graph';
import { useStoreState, useStoreActions } from '../../store/hooks';

import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import UnlockIcon from '../../../assets/icons/unlock.svg';

const baseStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 5,
  bottom: 10,
  left: 10,
};

interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {}

export default ({ style, className }: ControlProps) => {
  const mapClasses: string = classnames('react-flow__controls', className);

  const setInteractive = useStoreActions(actions => actions.setInteractive);
  const { isInteractive } = useStoreState(({ isInteractive }) => ({ isInteractive }));

  return (
    <div
      className={mapClasses}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
      <div
        className="react-flow__controls-button react-flow__controls-lock"
        onClick={() => setInteractive(!isInteractive)}
      >
        { isInteractive ? <UnlockIcon /> : <LockIcon /> }
      </div>
      <div
        className="react-flow__controls-button react-flow__controls-zoomin"
        onClick={zoomIn}
      >
        <PlusIcon />
      </div>
      <div
        className="react-flow__controls-button  react-flow__controls-zoomout"
        onClick={zoomOut}
      >
        <MinusIcon />
      </div>
      <div
        className="react-flow__controls-button  react-flow__controls-fitview"
        onClick={() => fitView()}
      >
        <FitviewIcon />
      </div>
    </div>
  );
};
