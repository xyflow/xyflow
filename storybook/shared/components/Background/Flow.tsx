import { FC } from 'react';

import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  Background,
  BackgroundProps,
  BackgroundVariant,
  type Node,
} from '@xyflow/react';

import { initialNodes, type BackgroundVariantName, type SharedBackgroundArgs } from './config';
import styles from './Flow.module.css';

const variantMap: Record<BackgroundVariantName, BackgroundVariant> = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
};

function mapBackgroundArgs(args: SharedBackgroundArgs = {}): BackgroundProps {
  const { variant, color, className, patternClassName, style, ...rest } = args;

  return {
    ...rest,
    ...(variant ? { variant: variantMap[variant] } : {}),
    ...(color ? { color } : {}),
    ...(className ? { className } : {}),
    ...(patternClassName ? { patternClassName } : {}),
    ...(style ? { style } : {}),
  };
}

export const BackgroundExample: FC<SharedBackgroundArgs> = ({ id = 'background', ...args }) => {
  const [nodes, , onNodesChange] = useNodesState([...initialNodes] as Node[]);
  const backgroundProps = mapBackgroundArgs(args);

  return (
    <ReactFlowProvider>
      <div className={styles.flow}>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange}>
          <Background id={id} {...backgroundProps} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default BackgroundExample;
