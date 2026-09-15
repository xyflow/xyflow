<script lang="ts">
  import { Panel, useNodes, useEdges, useSvelteFlow, MarkerType, type Node } from '@xyflow/svelte';
  import { layoutNodes } from './layout';
  const nodes = useNodes();
  const edges = useEdges();
  const { fitView } = useSvelteFlow();
  const layout = (direction: 'TB' | 'LR') => {
    nodes.current = layoutNodes(nodes.current, edges.current, direction) as Node[];
  };
</script>

<Panel position="top-left">
  <button onclick={() => layout('TB')}>vertical layout</button><button onclick={() => layout('LR')}
    >horizontal layout</button
  >
  <button
    onclick={() => {
      nodes.current = nodes.current.map((node) => ({ ...node, selected: false }));
    }}>unselect nodes</button
  >
  <button
    onclick={() => {
      edges.current = edges.current.map((edge) => ({
        ...edge,
        markerEnd: {
          type:
            typeof edge.markerEnd === 'object' && edge.markerEnd.type === MarkerType.Arrow
              ? MarkerType.ArrowClosed
              : MarkerType.Arrow,
        },
      }));
    }}>change marker</button
  >
  <button onclick={() => fitView()}>fitView</button><button
    onclick={() => fitView({ nodes: nodes.current.slice(0, 2) })}>fitView partially</button
  >
</Panel>
