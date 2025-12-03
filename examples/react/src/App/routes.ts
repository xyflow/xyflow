import A11y from '../examples/A11y';
import Basic from '../examples/Basic';
import Backgrounds from '../examples/Backgrounds';
import BrokenNodes from '../examples/BrokenNodes';
import ColorMode from '../examples/ColorMode';
import ClickDistance from '../examples/ClickDistance';
import ControlledUncontrolled from '../examples/ControlledUncontrolled';
import ControlledViewport from '../examples/ControlledViewport';
import CustomConnectionLine from '../examples/CustomConnectionLine';
import CustomMiniMapNode from '../examples/CustomMiniMapNode';
import CustomNode from '../examples/CustomNode';
import DefaultEdgeOverwrite from '../examples/DefaultEdgeOverwrite';
import DefaultNodeOverwrite from '../examples/DefaultNodeOverwrite';
import DefaultNodes from '../examples/DefaultNodes';
import DragHandle from '../examples/DragHandle';
import DragNDrop from '../examples/DragNDrop';
import EasyConnect from '../examples/EasyConnect';
import Edges from '../examples/Edges';
import EdgeRenderer from '../examples/EdgeRenderer';
import EdgeTypes from '../examples/EdgeTypes';
import Empty from '../examples/Empty';
import Figma from '../examples/Figma';
import FloatingEdges from '../examples/FloatingEdges';
import Hidden from '../examples/Hidden';
import Interaction from '../examples/Interaction';
import Intersection from '../examples/Intersection';
import Layouting from '../examples/Layouting';
import MultiFlows from '../examples/MultiFlows';
import MultiSetNodes from '../examples/MultiSetNodes';
import NodeResizer from '../examples/NodeResizer';
import NodeTypeChange from '../examples/NodeTypeChange';
import NodeTypesObjectChange from '../examples/NodeTypesObjectChange';
import Overview from '../examples/Overview';
import Provider from '../examples/Provider';
import SaveRestore from '../examples/SaveRestore';
import SetNodesBatching from '../examples/SetNodesBatching';
import Stress from '../examples/Stress';
import Subflow from '../examples/Subflow';
import SwitchFlow from '../examples/Switch';
import TouchDevice from '../examples/TouchDevice';
import Undirectional from '../examples/Undirectional';
import ReconnectEdge from '../examples/ReconnectEdge';
import UpdateNode from '../examples/UpdateNode';
import UseUpdateNodeInternals from '../examples/UseUpdateNodeInternals';
import UseReactFlow from '../examples/UseReactFlow';
import Validation from '../examples/Validation';
import UseKeyPress from '../examples/UseKeyPress';
import EdgeRouting from '../examples/EdgeRouting';
import CancelConnection from '../examples/CancelConnection';
import InteractiveMinimap from '../examples/InteractiveMinimap';
import UseOnSelectionChange from '../examples/UseOnSelectionChange';
import NodeToolbar from '../examples/NodeToolbar';
import EdgeToolbar from '../examples/EdgeToolbar';
import UseConnection from '../examples/UseConnection';
import UseNodesInitialized from '../examples/UseNodesInit';
import UseNodesData from '../examples/UseNodesData';
import UseNodeConnections from '../examples/UseNodeConnections';
import AddNodeOnEdgeDrop from '../examples/AddNodeOnEdgeDrop';
import DevTools from '../examples/DevTools';
import Redux from '../examples/Redux';
import MovingHandles from '../examples/MovingHandles';
import DetachedHandle from '../examples/DetachedHandle';
import ZIndexMode from '../examples/ZIndexMode';
import Middlewares from '../examples/Middlewares';

export interface IRoute {
  name: string;
  path: string;
  component: React.ComponentType;
}

const routes: IRoute[] = [
  {
    name: 'Add Node on edge Drop',
    path: 'add-node-edge-drop',
    component: AddNodeOnEdgeDrop,
  },
  {
    name: 'A11y',
    path: 'a11y',
    component: A11y,
  },
  {
    name: 'Basic',
    path: 'basic',
    component: Basic,
  },
  {
    name: 'Backgrounds',
    path: 'backgrounds',
    component: Backgrounds,
  },
  {
    name: 'Broken Nodes',
    path: 'broken-nodes',
    component: BrokenNodes,
  },
  {
    name: 'Color Mode',
    path: 'color-mode',
    component: ColorMode,
  },
  {
    name: 'Cancel Connection',
    path: 'cancel-connection',
    component: CancelConnection,
  },
  {
    name: 'Click Distance',
    path: 'click-distance',
    component: ClickDistance,
  },
  {
    name: 'Controlled/Uncontrolled',
    path: 'controlled-uncontrolled',
    component: ControlledUncontrolled,
  },
  {
    name: 'Controlled Viewport',
    path: 'controlled-viewport',
    component: ControlledViewport,
  },
  {
    name: 'Custom Connection Line',
    path: 'custom-connectionline',
    component: CustomConnectionLine,
  },
  {
    name: 'Custom Minimap Node',
    path: 'custom-minimap-node',
    component: CustomMiniMapNode,
  },
  {
    name: 'Custom Node',
    path: 'custom-node',
    component: CustomNode,
  },
  {
    name: 'Default Node Overwrite',
    path: 'default-node-overwrite',
    component: DefaultNodeOverwrite,
  },
  {
    name: 'Default Edge Overwrite',
    path: 'default-edge-overwrite',
    component: DefaultEdgeOverwrite,
  },
  {
    name: 'Default Nodes',
    path: 'default-nodes',
    component: DefaultNodes,
  },
  {
    name: 'DetachedHandle',
    path: 'detached-handle',
    component: DetachedHandle,
  },
  {
    name: 'DevTools',
    path: 'devtools',
    component: DevTools,
  },
  {
    name: 'Drag Handle',
    path: 'draghandle',
    component: DragHandle,
  },
  {
    name: 'Drag and Drop',
    path: 'dragndrop',
    component: DragNDrop,
  },
  {
    name: 'EasyConnect',
    path: 'easy-connect',
    component: EasyConnect,
  },
  {
    name: 'Edges',
    path: 'edges',
    component: Edges,
  },
  {
    name: 'Edge Renderer',
    path: 'edge-renderer',
    component: EdgeRenderer,
  },
  {
    name: 'Edge Types',
    path: 'edge-types',
    component: EdgeTypes,
  },
  {
    name: 'Edge Routing',
    path: 'edge-routing',
    component: EdgeRouting,
  },
  {
    name: 'Edge Toolbar',
    path: 'edge-toolbar',
    component: EdgeToolbar,
  },
  {
    name: 'Empty',
    path: 'empty',
    component: Empty,
  },
  {
    name: 'Figma',
    path: 'figma',
    component: Figma,
  },
  {
    name: 'Floating Edges',
    path: 'floating-edges',
    component: FloatingEdges,
  },
  {
    name: 'Hidden',
    path: 'hidden',
    component: Hidden,
  },
  {
    name: 'Interaction',
    path: 'interaction',
    component: Interaction,
  },
  {
    name: 'Intersection',
    path: 'intersection',
    component: Intersection,
  },
  {
    name: 'Interactive Minimap',
    path: 'interactive-minimap',
    component: InteractiveMinimap,
  },
  {
    name: 'Layouting',
    path: 'layouting',
    component: Layouting,
  },
  {
    name: 'Middlewares',
    path: 'middlewares',
    component: Middlewares,
  },
  {
    name: 'Multi setNodes',
    path: 'multi-setnodes',
    component: MultiSetNodes,
  },
  {
    name: 'Moving Handles',
    path: 'moving-handles',
    component: MovingHandles,
  },
  {
    name: 'Multi Flows',
    path: 'multiflows',
    component: MultiFlows,
  },
  {
    name: 'Node Type Change',
    path: 'nodetype-change',
    component: NodeTypeChange,
  },
  {
    name: 'nodeTypes Object Change',
    path: 'nodetypesobject-change',
    component: NodeTypesObjectChange,
  },
  {
    name: 'NodeToolbar',
    path: 'node-toolbar',
    component: NodeToolbar,
  },
  {
    name: 'NodeResizer',
    path: 'node-resizer',
    component: NodeResizer,
  },
  {
    name: 'Overview',
    path: 'overview',
    component: Overview,
  },
  {
    name: 'Provider',
    path: 'provider',
    component: Provider,
  },
  {
    name: 'Save/Restore',
    path: 'save-restore',
    component: SaveRestore,
  },
  {
    name: 'SetNodes Batching',
    path: 'setnodes-batching',
    component: SetNodesBatching,
  },
  {
    name: 'Stress',
    path: 'stress',
    component: Stress,
  },
  {
    name: 'Subflow',
    path: 'subflow',
    component: Subflow,
  },
  {
    name: 'Switch Flow',
    path: 'switch',
    component: SwitchFlow,
  },
  {
    name: 'Touch Device',
    path: 'touch-device',
    component: TouchDevice,
  },
  {
    name: 'Undirectional',
    path: 'undirectional',
    component: Undirectional,
  },
  {
    name: 'Reconnect Edge',
    path: 'reconnect-edge',
    component: ReconnectEdge,
  },
  {
    name: 'Update Node',
    path: 'update-node',
    component: UpdateNode,
  },
  {
    name: 'useConnection',
    path: 'use-connection',
    component: UseConnection,
  },
  {
    name: 'useNodesInitialized',
    path: 'use-nodes-initialized',
    component: UseNodesInitialized,
  },
  {
    name: 'useOnSelectionChange',
    path: 'use-on-selection-change',
    component: UseOnSelectionChange,
  },
  {
    name: 'useReactFlow',
    path: 'usereactflow',
    component: UseReactFlow,
  },
  {
    name: 'useNodeConnections',
    path: 'usenodeconnections',
    component: UseNodeConnections,
  },
  {
    name: 'useNodesData',
    path: 'usenodesdata',
    component: UseNodesData,
  },
  {
    name: 'useUpdateNodeInternals',
    path: 'useupdatenodeinternals',
    component: UseUpdateNodeInternals,
  },
  {
    name: 'redux',
    path: 'redux',
    component: Redux,
  },
  {
    name: 'Validation',
    path: 'validation',
    component: Validation,
  },
  {
    name: 'useKeyPress',
    path: 'use-key-press',
    component: UseKeyPress,
  },
  {
    name: 'zIndexMode',
    path: 'z-index-mode',
    component: ZIndexMode,
  },
];

export default routes;
