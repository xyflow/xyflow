import React, { useEffect, useState, CSSProperties } from 'react';
import cx from 'classnames';

import { ElementId, Node, Transform, HandleElement, Position } from '../../types';

interface ConnectionLineProps {
  connectionSourceId: ElementId;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType?: string | null;
  nodes: Node[];
  transform: Transform;
  isInteractive: boolean;
  connectionLineStyle?: CSSProperties;
  className?: string;
}

export default ({
  connectionSourceId,
  connectionLineStyle = {},
  connectionPositionX,
  connectionPositionY,
  connectionLineType,
  nodes = [],
  className,
  transform,
  isInteractive,
}: ConnectionLineProps) => {
  const [sourceNode, setSourceNode] = useState<Node | null>(null);
  const hasHandleId = connectionSourceId.includes('__');
  const sourceIdSplitted = connectionSourceId.split('__');
  const nodeId = sourceIdSplitted[0];
  const handleId = hasHandleId ? sourceIdSplitted[1] : null;

  useEffect(() => {
    const nextSourceNode = nodes.find((n) => n.id === nodeId) || null;
    setSourceNode(nextSourceNode);
  }, []);

  if (!sourceNode || !isInteractive) {
    return null;
  }

  const connectionLineClasses: string = cx('react-flow__connection', className);
  const hasSource = sourceNode.__rg.handleBounds.source !== null;

  // output nodes don't have source handles so we need to use the target one
  const handleKey = hasSource ? 'source' : 'target';

  const sourceHandle = handleId
    ? sourceNode.__rg.handleBounds[handleKey].find((d: HandleElement) => d.id === handleId)
    : sourceNode.__rg.handleBounds[handleKey][0];
  const sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNode.__rg.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.__rg.height;
  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetX = (connectionPositionX - transform[0]) * (1 / transform[2]);
  const targetY = (connectionPositionY - transform[1]) * (1 / transform[2]);

  let dAttr: string = '';

  if (connectionLineType === 'bezier') {
    if (sourceHandle?.position === Position.Left || sourceHandle?.position === Position.Right) {
      const xOffset = Math.abs(targetX - sourceX) / 2;
      const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
      dAttr = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
    } else {
      const yOffset = Math.abs(targetY - sourceY) / 2;
      const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
      dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;
    }
  } else {
    dAttr = `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }

  return (
    <g className={connectionLineClasses}>
      <path d={dAttr} className="react-flow__connection-path" style={connectionLineStyle} />
    </g>
  );
};
