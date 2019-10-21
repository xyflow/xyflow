import React, { CSSProperties } from 'react';
import classnames from 'classnames';

import { fitView, zoomIn, zoomOut } from '../../utils/graph';
import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import FitviewIcon from '../../../assets/icons/fitview.svg';

const baseStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 5,
  bottom: 10,
  left: 10,
};

interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {}

export default ({ style, className }: ControlProps) => {
  const mapClasses: string = classnames('react-flow__controls', className);

  return (
    <div
      className={mapClasses}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
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
