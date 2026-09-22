import { markRaw } from 'vue';
import { createTestConfigs } from '@shared/tests/fixtures';
import type { VueFlowProps, Node, Edge } from '@xyflow/vue';
import DragHandleNode from './components/DragHandleNode.vue';
const config = createTestConfigs('vue').nodesGeneral;
const flowProps = config.flowProps as Omit<VueFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
flowProps.nodeTypes = { DragHandleNode: markRaw(DragHandleNode) };
export default { flowProps } satisfies FlowConfig;
