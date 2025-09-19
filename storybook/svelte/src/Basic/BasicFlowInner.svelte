<script lang="ts">
  import { 
    SvelteFlow, 
    Controls, 
    Background, 
    BackgroundVariant,
    MiniMap,
    Panel,
    type Node, 
    type Edge,
    useSvelteFlow
  } from '@xyflow/svelte';
  
  import type { BasicFlowProps } from '../../../shared/basic/basic-stories';

  interface Props extends BasicFlowProps {}
  
  let {
    nodeDragThreshold = 0,
    classNames = 'light',
    isHidden = 'visible',
    onNodeDrag = () => {},
    onNodeDragStart = () => {},
    onNodeDragStop = () => {},
    onNodeClick = () => {},
  }: Props = $props();

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
      class: 'light',
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
      class: 'light',
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 400, y: 100 },
      class: 'light',
    },
    {
      id: '4',
      data: { label: 'Node 4' },
      position: { x: 400, y: 200 },
      class: 'light',
    },
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ];

  const defaultEdgeOptions = {};
  const fitViewOptions: any = {
    padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
  };

  // Reactive state
  let nodes = $state.raw<Node[]>([...initialNodes]);
  let edges = $state.raw<Edge[]>([...initialEdges]);

  const { 
    getNodes, 
    getEdges,
    deleteElements,
    updateNodeData,
    toObject,
    setViewport,
    fitView,
  } = useSvelteFlow();

  const updatePos = () => {
    nodes = nodes.map((node) => ({
      ...node,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    }));
  };

  const logToObject = () => console.log(toObject());
  const resetTransform = () => setViewport({ x: 0, y: 0, zoom: 1 });

  const deleteSelectedElements = () => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  };

  const deleteSomeElements = () => {
    deleteElements({ nodes: [{ id: '2' }], edges: [{ id: 'e1-3' }] });
  };

  const onSetNodes = () => {
    nodes = [
      { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node a' } },
      { id: 'b', position: { x: 0, y: 150 }, data: { label: 'Node b' } },
    ];
    edges = [{ id: 'a-b', source: 'a', target: 'b' }];
    fitView();
  };

  const onUpdateNode = () => {
    updateNodeData('1', { label: 'update' });
    updateNodeData('2', { label: 'update' });
  };

  const addNode = () => {
    nodes = [...nodes, {
      id: `${Math.random()}`,
      data: { label: 'Node' },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      class: 'light',
    }];
    fitView();
  };

  const printSelectionEvent = (name: string) => (event: MouseEvent, nodes: Node[]) => 
    console.log(name, nodes);
</script>

<SvelteFlow
  bind:nodes
  bind:edges
  onnodeclick={onNodeClick}
  onnodedragstop={onNodeDragStop}
  onnodedragstart={onNodeDragStart}
  onnodedrag={onNodeDrag}
  onselectiondragstart={printSelectionEvent('selection drag start')}
  onselectiondrag={printSelectionEvent('selection drag')}
  onselectiondragstop={printSelectionEvent('selection drag stop')}
  class={classNames}
  style="display: {isHidden === 'hidden' ? 'none' : 'block'}"
  minZoom={0.2}
  maxZoom={4}
  fitView
  fitViewOptions={fitViewOptions}
  defaultEdgeOptions={defaultEdgeOptions}
  selectNodesOnDrag={false}
  elevateEdgesOnSelect
  elevateNodesOnSelect={false}
  nodeDragThreshold={nodeDragThreshold}
>
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
  <Controls />

  <Panel position="top-right">
    <button onclick={resetTransform}>reset transform</button>
    <button onclick={updatePos}>change pos</button>
    <button onclick={logToObject}>toObject</button>
    <button onclick={deleteSelectedElements}>deleteSelectedElements</button>
    <button onclick={deleteSomeElements}>deleteSomeElements</button>
    <button onclick={onSetNodes}>setNodes</button>
    <button onclick={onUpdateNode}>updateNode</button>
    <button onclick={addNode}>addNode</button>
  </Panel>
</SvelteFlow>
