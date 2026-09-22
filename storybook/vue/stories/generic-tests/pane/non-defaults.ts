import { createTestConfigs } from '@shared/tests/fixtures';
import type { VueFlowProps, Node, Edge } from '@xyflow/vue';
const config = createTestConfigs('vue').paneNonDefaults;
const flowProps = config.flowProps as Omit<VueFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
export default { flowProps } satisfies FlowConfig;
