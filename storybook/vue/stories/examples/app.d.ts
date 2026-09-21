import type { Background, Controls, Edge, MiniMap, Node, Panel, VueFlowProps } from '@xyflow/vue';

type BackgroundProps = InstanceType<typeof Background>['$props'];
type ControlsProps = InstanceType<typeof Controls>['$props'];
type MiniMapProps = InstanceType<typeof MiniMap>['$props'];
type PanelProps = InstanceType<typeof Panel>['$props'];

declare global {
  interface FlowConfig {
    flowProps?: Omit<VueFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
    panelProps?: PanelProps;
    backgroundProps?: BackgroundProps;
    controlsProps?: ControlsProps;
    minimapProps?: MiniMapProps;
  }
}

export {};
