<script lang="ts">
  import { SvelteFlow, Background, useSvelteFlow, type Node, type Edge, type OnConnectEnd } from '@xyflow/svelte';
  import { defaultFlowProps } from '../../../defaultFlow';
  import { dropPosition } from './config';
  let nodes = $state.raw<Node[]>(structuredClone(defaultFlowProps.nodes));
  let edges = $state.raw<Edge[]>(structuredClone(defaultFlowProps.edges));
  const { screenToFlowPosition } = useSvelteFlow();
  const onconnectend: OnConnectEnd = (event, connection) => {
    if (
      connection.isValid ||
      !connection.fromNode ||
      !(event.target instanceof Element) ||
      !event.target.classList.contains('svelte-flow__pane')
    )
      return;
    const pointer = dropPosition(event);
    if (!pointer) return;
    const id = crypto.randomUUID();
    nodes = [...nodes, { id, position: screenToFlowPosition(pointer), origin: [0.5, 0], data: { label: 'New node' } }];
    const from = connection.fromNode.id;
    const handle = connection.fromHandle;
    edges = [
      ...edges,
      {
        id: `edge-${id}`,
        ...(handle?.type === 'target'
          ? { source: id, target: from, targetHandle: handle.id }
          : { source: from, sourceHandle: handle?.id, target: id }),
      },
    ];
  };
</script>

<div style="height: 100vh;">
  <SvelteFlow {...defaultFlowProps} bind:nodes bind:edges {onconnectend}><Background /></SvelteFlow>
</div>
