import { BackgroundProps, ControlProps, Edge, MiniMapProps, Node, PanelProps, ReactFlowProps } from '@xyflow/react';

declare global {
  interface FlowConfig {
    flowProps?: Omit<ReactFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
    panelProps?: PanelProps;
    backgroundProps?: BackgroundProps;
    controlsProps?: ControlProps;
    minimapProps?: MiniMapProps;
  }
}
