import { useCallback, useState } from 'react';
import { useOnViewportChange } from '@xyflow/react';

type ViewportChangeListenerProps = {
  onStart: () => void;
  onChange: () => void;
  onEnd: () => void;
};

function ViewportChangeListener({ onStart, onChange, onEnd }: ViewportChangeListenerProps) {
  useOnViewportChange({ onStart, onChange, onEnd });

  return null;
}

export default function ViewportChangeHookNode() {
  const [listening, setListening] = useState(true);
  const [calls, setCalls] = useState({ start: 0, change: 0, end: 0 });

  const onStart = useCallback(() => setCalls((current) => ({ ...current, start: current.start + 1 })), []);
  const onChange = useCallback(() => setCalls((current) => ({ ...current, change: current.change + 1 })), []);
  const onEnd = useCallback(() => setCalls((current) => ({ ...current, end: current.end + 1 })), []);

  return (
    <div className="nodrag nopan" style={{ padding: 8, background: 'white' }}>
      {listening && <ViewportChangeListener onStart={onStart} onChange={onChange} onEnd={onEnd} />}
      <button onClick={() => setListening(false)}>Remove listener</button>
      <output data-testid="viewport-start-calls">{calls.start}</output>
      <output data-testid="viewport-change-calls">{calls.change}</output>
      <output data-testid="viewport-end-calls">{calls.end}</output>
    </div>
  );
}
