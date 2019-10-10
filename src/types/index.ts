import * as React from 'react';

export type ElementId = string | number;

export interface Node {
  id: ElementId,
  type?: string,
};

export interface Edge {
  id: ElementId,
  type?: string,
};

export interface ReactFlowProps {
  elements: Array<Node | Edge>,
  style?: React.CSSProperties,
  className?: string,
  children?: React.ReactNode[],
  onElementClick?: () => void,
  onElementsRemove?: () => void,
  onNodeDragStop?: () => void,
  onConnect?: () => void,
	onLoad?: () => void,
  onMove?: () => void,
  nodeTypes?: {
    [key: string]: React.ReactNode
  },
  edgeTypes?: {
    [key: string]: React.ReactNode
  },
  connectionLineType?: string,
  connectionLineStyle?: any,
  deleteKeyCode?: number,
  selectionKeyCode?: number,
  gridColor?: string,
  gridGap?: number,
  showBackground?: boolean,
  backgroundGap?: number,
  backgroundColor?: string,
  backgroundType?: 'lines' | 'dots'
};
