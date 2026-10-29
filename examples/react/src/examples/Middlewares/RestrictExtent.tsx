import { NodeChange, experimental_useOnNodesChangeMiddleware } from '@xyflow/react';
import { useCallback, useState } from 'react';

export function RestrictExtent({
  label = 'Restrict Extent',
  minX = -Infinity,
  minY = -Infinity,
  maxX = Infinity,
  maxY = Infinity,
}: {
  label?: string;
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
}) {
  const [isEnabled, setIsEnabled] = useState(false);
  experimental_useOnNodesChangeMiddleware(
    useCallback(
      (changes: NodeChange[]) => {
        if (!isEnabled) return changes;
        return changes.map((change) => {
          const { type } = change;
          if (type === 'position') {
            const { position } = change;
            if (position) {
              position.x = Math.min(Math.max(position.x, minX), maxX);
              position.y = Math.min(Math.max(position.y, minY), maxY);
              change.position = position;
            }
          } else if (type === 'add' || type === 'replace') {
            const { item } = change;
            if (item) {
              item.position.x = Math.min(Math.max(item.position.x, minX), maxX);
              item.position.y = Math.min(Math.max(item.position.y, minY), maxY);
              change.item = item;
            }
          }
          return change;
        });
      },
      [minX, minY, maxX, maxY, isEnabled]
    )
  );

  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
        {label}
      </label>
    </div>
  );
}
