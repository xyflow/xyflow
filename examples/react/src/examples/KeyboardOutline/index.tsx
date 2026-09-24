import { useEffect, useId, useRef, useState } from 'react';
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import './style.css';

type WorkflowNode = Node<{ label: string; description: string }>;

// This is a product-defined reading order, independent of coordinates or edges.
const initialNodes: WorkflowNode[] = [
  {
    id: 'request',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Request received', description: 'Start both design review and automated checks.' },
  },
  {
    id: 'review',
    position: { x: 40, y: 160 },
    data: { label: 'Design review', description: 'Approve the draft or send it back for changes.' },
  },
  {
    id: 'revise',
    position: { x: 40, y: 340 },
    sourcePosition: Position.Left,
    data: { label: 'Revise draft', description: 'Address feedback, then return to design review.' },
  },
  {
    id: 'checks',
    position: { x: 460, y: 160 },
    data: { label: 'Automated checks', description: 'Verify quality before publishing.' },
  },
  {
    id: 'publish',
    type: 'output',
    position: { x: 460, y: 340 },
    data: { label: 'Publish', description: 'The workflow ends here.' },
  },
].map((node) => ({ ...node, domAttributes: { tabIndex: -1 } }));

const initialEdges: Edge[] = [
  { id: 'request-review', source: 'request', target: 'review', label: 'Design' },
  { id: 'request-checks', source: 'request', target: 'checks', label: 'Quality' },
  { id: 'review-revise', source: 'review', target: 'revise', label: 'Changes requested' },
  { id: 'revise-review', source: 'revise', target: 'review', label: 'Review again', type: 'step' },
  { id: 'review-publish', source: 'review', target: 'publish', label: 'Approved' },
  { id: 'checks-publish', source: 'checks', target: 'publish', label: 'Passed' },
];

const defaultEdgeOptions = { markerEnd: { type: MarkerType.ArrowClosed } };

function KeyboardOutline() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeId, setActiveId] = useState<string | undefined>('request');
  const [announcement, setAnnouncement] = useState('');
  const flow = useReactFlow<WorkflowNode>();
  const canvasRef = useRef<HTMLDivElement>(null);
  const outlineButtons = useRef(new Map<string, HTMLButtonElement>());
  const resetRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocus = useRef(false);
  const headingId = useId();
  const activeNode = nodes.find((node) => node.id === activeId);
  const visibleNodes = nodes.filter((node) => !node.hidden);
  const outgoing = edges.filter(
    (edge) => !edge.hidden && edge.source === activeId && visibleNodes.some((node) => node.id === edge.target)
  );

  useEffect(() => {
    if (!shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    (activeId ? outlineButtons.current.get(activeId) : resetRef.current)?.focus();
  }, [nodes, activeId]);

  async function showOnCanvas() {
    if (!activeNode) return;
    const id = activeNode.id;
    // No animation: this is a keyboard navigation action, including with reduced motion.
    await flow.fitView({ nodes: [{ id }], padding: 1, maxZoom: 1, duration: 0 });
    // Let native focus reveal the node when the narrow layout puts the canvas
    // below the outline. fitView only moves the viewport inside the canvas.
    canvasRef.current?.querySelector<HTMLElement>(`.react-flow__node[data-id="${CSS.escape(id)}"]`)?.focus();
  }

  function handleNodesDelete(deleted: WorkflowNode[]) {
    if (!deleted.some((node) => node.id === activeId)) return;
    const index = visibleNodes.findIndex((node) => node.id === activeId);
    const remaining = visibleNodes.filter((node) => !deleted.some((item) => item.id === node.id));
    const next = remaining[Math.min(index, remaining.length - 1)];
    shouldRestoreFocus.current = true;
    setActiveId(next?.id);
    setAnnouncement(
      next ? `Step removed. ${next.data.label} is selected.` : 'No steps remain. Reset the example to start again.'
    );
  }

  function reset() {
    shouldRestoreFocus.current = true;
    setNodes(initialNodes);
    setEdges(initialEdges);
    setActiveId('request');
    setAnnouncement('Example reset. Request received is selected.');
  }

  return (
    <div className="keyboard-outline">
      <aside className="keyboard-outline__sidebar" aria-labelledby={headingId}>
        <div>
          <h1 id={headingId}>Workflow outline</h1>
          <p>Explore the steps in reading order. Follow a connection to choose a branch.</p>
        </div>
        <ol className="keyboard-outline__steps">
          {visibleNodes.map((node) => (
            <li key={node.id}>
              <button
                className="keyboard-outline__button"
                ref={(element) => {
                  if (element) outlineButtons.current.set(node.id, element);
                  else outlineButtons.current.delete(node.id);
                }}
                aria-pressed={node.id === activeId}
                onClick={() => setActiveId(node.id)}
              >
                {node.data.label}
              </button>
            </li>
          ))}
        </ol>
        {activeNode && (
          <section className="keyboard-outline__details" aria-label="Selected step">
            <h2>{activeNode.data.label}</h2>
            <p>{activeNode.data.description}</p>
            <button className="keyboard-outline__button" onClick={() => void showOnCanvas()}>
              Show on canvas
            </button>
            <h3>Outgoing connections</h3>
            {outgoing.length ? (
              <ul className="keyboard-outline__connections">
                {outgoing.map((edge) => {
                  const target = visibleNodes.find((node) => node.id === edge.target)!;
                  return (
                    <li key={edge.id}>
                      <button
                        className="keyboard-outline__button"
                        onClick={() => {
                          setActiveId(target.id);
                          outlineButtons.current.get(target.id)?.focus();
                        }}
                      >
                        {edge.label}: {target.data.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No outgoing connections.</p>
            )}
          </section>
        )}
        <p className="keyboard-outline__hint">
          On the canvas, arrow keys move the selected node. Escape returns to its outline button.
        </p>
        <div className="keyboard-outline__demo-controls">
          <button
            className="keyboard-outline__button"
            disabled={!activeNode}
            onClick={() => {
              if (activeNode) void flow.deleteElements({ nodes: [{ id: activeNode.id }] });
            }}
          >
            Remove selected step
          </button>
          <button className="keyboard-outline__button" ref={resetRef} onClick={reset}>
            Reset example
          </button>
        </div>
        <span className="keyboard-outline__status" role="status">
          {announcement}
        </span>
      </aside>
      <div
        ref={canvasRef}
        className="keyboard-outline__canvas"
        onKeyDownCapture={(event) => {
          if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
          const id = event.target.closest<HTMLElement>('.react-flow__node')?.dataset.id;
          if (!id) return;
          event.preventDefault();
          event.stopPropagation();
          outlineButtons.current.get(id)?.focus();
        }}
      >
        <ReactFlow
          nodes={nodes.map((node) => ({ ...node, selected: node.id === activeId }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setActiveId(node.id)}
          onNodesDelete={handleNodesDelete}
          edgesFocusable={false}
          autoPanOnNodeFocus={false}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          colorMode="light"
          minZoom={0.2}
          ariaLabelConfig={{
            'node.a11yDescription.default':
              'Use arrow keys to move this node. Press Escape to return to the workflow outline.',
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <KeyboardOutline />
    </ReactFlowProvider>
  );
}
