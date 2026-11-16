import { useEffect, useRef, useState } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlowStoreApi, useViewportStore } from '@xyflow/react';

function ViewportResize() {
  const [containerWidth, setContainerWidth] = useState(800);
  const [publications, setPublications] = useState(0);
  const sibling = useRef<HTMLDivElement>(null);
  const { viewportStore } = useReactFlowStoreApi();
  const width = useViewportStore((state) => state.width);
  const height = useViewportStore((state) => state.height);

  useEffect(() => viewportStore.subscribe(() => setPublications((count) => count + 1)), [viewportStore]);

  useEffect(() => {
    // A sibling layout consumer is shallower than the flow renderer. Publishing
    // its width during ResizeObserver delivery invalidates an active observation.
    const observer = new ResizeObserver(() => {});
    observer.observe(sibling.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setContainerWidth((current) => (current === 800 ? 600 : 800))}>Resize flow</button>
      <output data-testid="viewport-size">
        {width}x{height}
      </output>
      <output data-testid="resize-publications">{publications}</output>
      <div ref={sibling} style={{ width: Math.max(1, width), height: 4, background: 'steelblue' }} />
      <div style={{ width: containerWidth, height: 400 }}>
        <ReactFlow />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <ViewportResize />
    </ReactFlowProvider>
  );
}
