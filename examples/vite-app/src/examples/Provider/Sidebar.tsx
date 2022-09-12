import React from 'react';
import { useStore, useStoreApi } from 'reactflow';

import styles from './provider.module.css';

const Sidebar = () => {
  const store = useStoreApi();
  const nodeInternals = useStore((store) => store.nodeInternals);
  const transform = useStore((store) => store.transform);

  const selectAll = () => {
    nodeInternals.forEach((node) => (node.selected = true));
    store.setState({ nodeInternals: new Map(nodeInternals) });
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.description}>
        This is an example of how you can access the internal state outside of the ReactFlow component.
      </div>
      <div className={styles.title}>Zoom & pan transform</div>
      <div className={styles.transform}>
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div className={styles.title}>Nodes</div>
      {Array.from(nodeInternals).map(([, node]) => (
        <div key={node.id}>
          Node {node.id} - x: {node.position.x.toFixed(2)}, y: {node.position.y.toFixed(2)}
        </div>
      ))}

      <div className={styles.selectall}>
        <button onClick={selectAll}>select all nodes</button>
      </div>
    </aside>
  );
};

export default Sidebar;
