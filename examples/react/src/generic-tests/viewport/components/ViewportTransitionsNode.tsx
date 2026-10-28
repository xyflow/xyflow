import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';

// long enough for a test to interrupt the transition halfway
const duration = 5000;

export default () => {
  const { fitView, setCenter, setViewport, zoomTo, zoomIn } = useReactFlow();
  const [status, setStatus] = useState('idle');

  const track = async (name: string, transition: () => Promise<boolean>) => {
    setStatus(`${name}: pending`);
    const ended = await transition();
    setStatus(`${name}: ${ended ? 'ended' : 'interrupted'}`);
  };

  const setCenterThenSetViewport = () => {
    const transition = setCenter(800, 600, { zoom: 2, duration });
    setViewport({ x: 0, y: 0, zoom: 1 });
    return transition;
  };

  const fitViewTwice = () => {
    const transition = fitView({ nodes: [{ id: 'target' }], duration });
    setTimeout(() => fitView({ nodes: [{ id: 'transitions' }], duration: 2000 }), 500);
    return transition;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, background: 'white' }}>
      <button
        className="nodrag"
        onClick={() => track('fit view', () => fitView({ nodes: [{ id: 'target' }], duration }))}
      >
        fit view
      </button>
      <button className="nodrag" onClick={() => track('set center', () => setCenter(800, 600, { zoom: 2, duration }))}>
        set center
      </button>
      <button className="nodrag" onClick={() => track('zoom to', () => zoomTo(2, { duration }))}>
        zoom to
      </button>
      <button className="nodrag" onClick={() => track('zoom in', () => zoomIn({ duration }))}>
        zoom in
      </button>
      <button
        className="nodrag"
        onClick={() => track('set center briefly', () => setCenter(800, 600, { zoom: 2, duration: 200 }))}
      >
        set center briefly
      </button>
      <button className="nodrag" onClick={() => track('set center then set viewport', setCenterThenSetViewport)}>
        set center then set viewport
      </button>
      <button className="nodrag" onClick={() => track('fit view twice', fitViewTwice)}>
        fit view twice
      </button>
      <div role="status">{status}</div>
    </div>
  );
};
