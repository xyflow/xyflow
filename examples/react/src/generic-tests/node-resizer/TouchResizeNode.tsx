import { useState } from 'react';
import { NodeResizeControl } from '@xyflow/react';

export default function TouchResizeNode() {
  const [width, setWidth] = useState(130);
  const [finishedWidths, setFinishedWidths] = useState<number[]>([]);

  return (
    <>
      <NodeResizeControl
        position="bottom-right"
        style={{ width: 18, height: 18 }}
        onResize={(_, { width }) => setWidth(width)}
        onResizeEnd={() => setFinishedWidths((widths) => [...widths, width])}
      />
      <output data-testid="resize-width">{width}</output>
      <output data-testid="finished-widths">{finishedWidths.join(', ')}</output>
    </>
  );
}
