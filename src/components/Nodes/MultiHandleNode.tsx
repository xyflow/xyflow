import React, { memo, FC } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position, HandleType } from '../../types';

type NodeData = {
  label: string
  handles: NodeHandles
}

type NodeHandles = {
  [key: string]: SideHandles // key is Position
}

type SideHandles = {
  type: HandleType
  ids: string[]
}

const MultiHandleNode: FC<NodeProps<NodeData>> = ({data}) => {
  let handleComponents = [];
  for (const position in data.handles) {
    const sideHandles = data.handles[position];
    const numHandles = sideHandles.ids.length;
    for (let i = 0; i < numHandles; i++) {
      const id = sideHandles.ids[i];
      const relativePosition = (i + 1) / (numHandles + 1);
      const positionPercentString = String(100 * relativePosition) + "%";
      const style =
        (position === Position.Top || position === Position.Bottom)
          ? { left: positionPercentString }
          : { top: positionPercentString };
      handleComponents.push(
        <Handle
          key={id}
          type={sideHandles.type}
          position={position as Position}
          id={id}
          style={style}
          isConnectable={true}
        />
      );
    }
  }

  return (
    <>
      {data.label}
      {handleComponents}
    </>
  );
};

export default memo(MultiHandleNode);
