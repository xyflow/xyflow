import type {
  BackgroundArgs,
  ControlsArgs,
  Edge,
  EdgeToolbarArgs,
  EmberFlowArgs,
  MiniMapArgs,
  Node,
  PanelArgs,
} from '@xyflow/ember';

export interface FlowConfig {
  flowProps: EmberFlowArgs<Node, Edge> & {
    nodes: Node[];
    edges: Edge[];
  };
  panelProps?: PanelArgs;
  backgroundProps?: BackgroundArgs;
  controlsProps?: ControlsArgs;
  edgeToolbarProps?: EdgeToolbarArgs;
  minimapProps?: MiniMapArgs;
}
