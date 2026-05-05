'use client';

import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { use } from 'react';

export type PositionLoggerNodeData = {
  label?: string;
};

export type PositionLoggerNode = Node<PositionLoggerNodeData>;

const textPromises = new Map<string, Promise<string>>();

function getTextPromise(nodeId: string): Promise<string> {
  let p = textPromises.get(nodeId);

  if (!p) {
    p = new Promise((resolve) => {
      setTimeout(() => resolve(`data for ${nodeId}`), 1000);
    });
    textPromises.set(nodeId, p);
  }

  return p;
}

export default function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
}: NodeProps<PositionLoggerNode>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;
  const text = use(getTextPromise(id));

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}
      {text && <div>{text}</div>}
      <div>
        {x} {y}
      </div>
      <div>hello</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
