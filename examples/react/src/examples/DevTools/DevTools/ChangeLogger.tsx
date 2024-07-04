import { useEffect, useRef, useState } from 'react';
import { NodeChange, OnNodesChange, useStore, useStoreApi } from '@xyflow/react';

type ChangeLoggerProps = {
  color?: string;
  limit?: number;
};

type ChangeInfoProps = {
  change: NodeChange;
};

function ChangeInfo({ change }: ChangeInfoProps) {
  const id = 'id' in change ? change.id : '-';
  const { type } = change;

  return (
    <div style={{ marginBottom: 4 }}>
      <div>node id: {id}</div>
      <div>
        {type === 'add' ? JSON.stringify(change.item, null, 2) : null}
        {type === 'dimensions' ? `${change.dimensions?.width} × ${change.dimensions?.height}` : null}
        {type === 'position' ? `position: ${change.position?.x.toFixed(1)}, ${change.position?.y.toFixed(1)}` : null}
        {type === 'remove' ? 'remove' : null}
        {type === 'replace' ? JSON.stringify(change.item, null, 2) : null}
        {type === 'select' ? (change.selected ? 'select' : 'unselect') : null}
      </div>
    </div>
  );
}

export default function ChangeLogger({ limit = 20 }: ChangeLoggerProps) {
  const [changes, setChanges] = useState<NodeChange[]>([]);
  const onNodesChangeIntercepted = useRef(false);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const store = useStoreApi();

  useEffect(() => {
    if (!onNodesChange || onNodesChangeIntercepted.current) {
      return;
    }

    onNodesChangeIntercepted.current = true;
    const userOnNodesChange = onNodesChange;

    const onNodesChangeLogger: OnNodesChange = (changes) => {
      userOnNodesChange(changes);

      setChanges((c) => {
        changes.forEach((change) => {
          if (c.length >= limit) {
            c.pop();
          }

          c = [change, ...c];
        });
        return c;
      });
    };

    store.setState({ onNodesChange: onNodesChangeLogger });
  }, [onNodesChange]);

  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title">Change Logger</div>
      {changes.length === 0 ? (
        <>no changes triggered</>
      ) : (
        changes.map((change, index) => <ChangeInfo key={index} change={change} />)
      )}
    </div>
  );
}
