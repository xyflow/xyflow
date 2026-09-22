import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import { addEdge, type Node, type Edge, type Connection } from '@xyflow/vue';
import { FLOW_STORY_RESET_EVENT } from '../tests/suite';
import type { SharedFlowProps } from '../types';

export function useFlowFixture(fixture: SharedFlowProps) {
  const nodes = shallowRef<Node[]>(structuredClone(fixture.nodes ?? []) as Node[]);
  const edges = shallowRef<Edge[]>(structuredClone(fixture.edges ?? []) as Edge[]);
  const resetKey = ref(0);
  const reset = () => {
    nodes.value = structuredClone(fixture.nodes ?? []) as Node[];
    edges.value = structuredClone(fixture.edges ?? []) as Edge[];
    resetKey.value++;
  };
  onMounted(() => window.addEventListener(FLOW_STORY_RESET_EVENT, reset));
  onBeforeUnmount(() => window.removeEventListener(FLOW_STORY_RESET_EVENT, reset));
  const onConnect = (connection: Connection) => {
    edges.value = addEdge(connection, edges.value);
  };
  return { nodes, edges, resetKey, onConnect };
}
