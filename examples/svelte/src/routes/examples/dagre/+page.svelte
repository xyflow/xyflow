<script lang="ts">
  import { writable } from 'svelte/store';
  import { SvelteFlow, Background, Position, ConnectionLineType, Panel } from '@xyflow/svelte';
  import type { Edge, Node } from '@xyflow/svelte';
  import dagre from '@dagrejs/dagre';

  import '@xyflow/svelte/dist/style.css';

  import { initialNodes, initialEdges } from './nodes-and-edges';

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      };
    });

    return { nodes, edges };
  }

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const nodes = writable<Node[]>(layoutedNodes);
  const edges = writable<Edge[]>(layoutedEdges);

  function onLayout(direction: string) {
    const layoutedElements = getLayoutedElements($nodes, $edges, direction);

    $nodes = layoutedElements.nodes;
    $edges = layoutedElements.edges;
    // nodes.set(layoutedElements.nodes);
    // edges.set(layoutedElements.edges);
  }
</script>

<div style="height:100vh;">
  <SvelteFlow
    {nodes}
    {edges}
    fitView
    connectionLineType={ConnectionLineType.SmoothStep}
    defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
  >
    <Panel position="top-right">
      <button on:click={() => onLayout('TB')}>vertical layout</button>
      <button on:click={() => onLayout('LR')}>horizontal layout</button>
    </Panel>
    <Background />
  </SvelteFlow>
</div>
